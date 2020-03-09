import log from 'loglevel';
log.setLevel('info');

import chai from 'chai';
const expect = chai.expect;

import React, {
  useState, Fragment,
} from 'react';

import {
  initializeBlock,
  loadCSSFromString,
  loadScriptFromURLAsync,
	Box,
	Loader
} from '@airtable/blocks/ui';

import {
  base,
  cursor,
  globalConfig,
  session,
} from '@airtable/blocks';

import {
  Editor
} from '@tinymce/tinymce-react';

import Frame, {
  FrameContextConsumer
} from 'react-frame-component';

import {
  SuperblockWrapper
} from './Superblocks';


// Remove the default tinymce table of contents border  
const myMceStyles = `.mce-toc {
	border-width: 0;
}`;

loadCSSFromString(myMceStyles);


const editIconStyles = `

.editIcon {
	height: 20px;
	width: 20px;
	color: black;
	opacity: 0.6;
}

.editButton {
	position: fixed;
	z-index: 2;
	top: 8px;
	right: 8px;
}

.editButton:hover {
	opacity: 0.8;
}
`;

loadCSSFromString(editIconStyles);

/**
 * The SVG of this [Edit Icon]{@link https://fontawesome.com/icons/edit?style=solid} was downloaded from [Font Awesome]{@link https://fontawesome.com/}
 * License - [Creative Commons Attribution 4.0 International license]{@link https://fontawesome.com/license}
 */

const getEditIcon = function({classes, tooltip = ""}) {
	return  `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="${classes} svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
	<title>${tooltip}</title>
	<path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>`;
}


/**
 * Intercept clicks on links in the doc and if the link points to a view in the current base,
 * navigate to the view in the current tab, instead of opening a new tab
 * @param {*} event The dom event 
 */
const NavigationInterceptor = function(event) {
	log.debug("NavigationInterceptor");
	
	// If the user didn't click on a link  
  if ( ! (event.target instanceof HTMLAnchorElement) ) {
    return;
	}
	// If the link doesn't point to airtable
  if (event.target.hostname !== 'airtable.com') {
    return;
  }
	// If the link points to airtable's homepage
  if (event.target.pathname == null) {
    return;
  }
	// If the link doesn't have an airtable view link structure, in the format:
	// https://airtable.com/tableId/viewId/optionalRecordId
  const ids = event.target.pathname.slice(1).split('/');
  if (ids.length < 2) {
    return;
  }
	// If the link doesn't point to a table in the current base
  const table = base.getTableByIdIfExists(ids[0]);
  if (table == null) {
    return;
  }
	// If the link doesn't point to a view in the current base
  const view = table.getViewByIdIfExists(ids[1]);
  if (view == null) {
    return;
  }
	log.debug(event);

	// Switch to the view in the current tab instead of the default behavior 
	// of opening it in a new tab
  event.preventDefault();
  cursor.setActiveView(table, view);
  return false;
};


const EazydocsBlock = function() {
  log.debug('EazydocsBlock.render');

	// throw new Error('Testing ErrorBoundary');

	// Remember each user's last mode - edit or view, so they can go back to the same
	// next time block loads
	let intialEditModeValue = false;
	const currentUserId = session.currentUser.id;
	let editModeGlobalConfigKey;
	if (currentUserId != null) {
		editModeGlobalConfigKey = ['settings', 'user', currentUserId, 'editMode']
		const savedEditModeValue = globalConfig.get(editModeGlobalConfigKey);
		if (savedEditModeValue != null) {
			intialEditModeValue = savedEditModeValue;
		}
	}

	const [editMode, setEditMode] = useState(intialEditModeValue);

	const switchToEditMode = () => {
		log.debug('switchToEditMode')
		setEditMode(true);
		globalConfig.setAsync(editModeGlobalConfigKey, true);
	}

	const switchToViewMode = () => {
		log.debug('switchToViewMode')
		setEditMode(false);
		globalConfig.setAsync(editModeGlobalConfigKey, false);
	}

	const hasEditPermission = globalConfig.hasPermissionToSet('content', 'value');

	let content;	
	const savedContent = globalConfig.get('content');
  log.debug(`savedContent=${savedContent}`);
  if (savedContent != null && savedContent.length > 0) {
    content = savedContent;
  }	else if (editMode) {
		const viewIcon = '<span class="tox-icon tox-tbtn__icon-wrap"><svg width="24" height="24"><path d="M3.5 12.5c.5.8 1.1 1.6 1.8 2.3 2 2 4.2 3.2 6.7 3.2s4.7-1.2 6.7-3.2a16.2 16.2 0 0 0 2.1-2.8 15.7 15.7 0 0 0-2.1-2.8c-2-2-4.2-3.2-6.7-3.2a9.3 9.3 0 0 0-6.7 3.2A16.2 16.2 0 0 0 3.2 12c0 .2.2.3.3.5zm-2.4-1l.7-1.2L4 7.8C6.2 5.4 8.9 4 12 4c3 0 5.8 1.4 8.1 3.8a18.2 18.2 0 0 1 2.8 3.7v1l-.7 1.2-2.1 2.5c-2.3 2.4-5 3.8-8.1 3.8-3 0-5.8-1.4-8.1-3.8a18.2 18.2 0 0 1-2.8-3.7 1 1 0 0 1 0-1zm12-3.3a2 2 0 1 0 2.7 2.6 4 4 0 1 1-2.6-2.6z" fill-rule="nonzero"></path></svg></span>'
		content = `<p>Edit content here.</p>\
<p>Click the ${viewIcon} toolbar button to switch to read mode.</p>\
<p><strong>Note:</strong> Document is automatically saved while you edit.</p>\
<p></p>`;
	// We assume that if the user has permission to set content, it will have permission to set 
	// all other global config keys we use. 
  } else if (hasEditPermission) {
    content = `Click the top right ${getEditIcon({classes: 'editIcon'})} button to edit this document.`;
  } else {
    content = `Only base editors, creators and owners can edit this document.`;
	}

	if (editMode) {
		return <HtmlEditor content={content} switchToViewMode={switchToViewMode} />;
  } else {
    return <HtmlViewer content={content} switchToEditMode={switchToEditMode} hasEditPermission={hasEditPermission} />;
	}
};


/**
 * We are using the excellent react-frame-component package to display the html content
 * in an iframe, so we can render the html without style interferences and make it look
 * exactly the way it looks inside the tinymce editor
 * 
 * @param {*} content The html content to display inside the iframe 
 */
const HtmlViewer = function({content, switchToEditMode, hasEditPermission}) {
  log.debug("HtmlViewer.render");
	expect(switchToEditMode).to.be.ok

	const style = {
    position: 'fixed',
    left: 0,
    bottom: '24px',
    width: '100%',
    height: 'calc(100vh - 24px)',
    boxSizing: 'border-box',
    top: 0,
    overflowY: 'auto',
    overflowX: 'auto',
    overflowWrap: 'break-word',
    padding: '8px',
    borderWidth: 0,
    borderImageWidth: 0
  };

	// The initial content of the iframe in which we display the html output of the tinymce editor
	// The iframe page loads the default tinymce style so the content will look the same as in the editor
	const initialContent = `<!DOCTYPE html><html>
<head>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.2.0/skins/content/default/content.min.css" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.2.0/skins/ui/oxide/content.min.css" rel="stylesheet">
	<style type="text/css">
	${myMceStyles}
	${hasEditPermission ? editIconStyles : ''}
	</style>
</head>
<body>
	${hasEditPermission ? getEditIcon({classes: 'editIcon editButton', tooltip: 'Switch to edit mode'}) : ''} 
	<div id='htmlContent'></div>
	<div id='mountHere'></div>
</body>
</html>`;
	
	/**
	 * @param {*} mountTarget is used when you render react components inside the Frame component
	 * We don't do that, we set the innerHTML so we don't use it.
	 */
  return <Fragment>
		<Frame style={style} initialContent={initialContent} mountTarget='#mountHere'>
			<FrameContextConsumer>
				{({document/*, window*/}) => {
			// Will interept clicks on links to current base  
			document.body.onclick = NavigationInterceptor;
			document.querySelectorAll('.editButton').forEach( (editButton) => {
				editButton.onclick = switchToEditMode;
			});
			document.getElementById('htmlContent').innerHTML = content;
			return null;
		}}
			</FrameContextConsumer>
		</Frame>
	</Fragment>;
};



const LoadingSpinner = function() {
	// We set backgroundColor and zIndex so it overlaps tinymce until it's initialized.
	return <Box backgroundColor='white' zIndex='2' position='fixed' display='flex' width='100vw' height='calc(100vh - 24px)' top='0' justifyContent='center' alignItems='center'>
		<Loader />
	</Box>
}


// We load the tinymce script only after the editor was called for the first time,
// since if it is never called, no need to load it.
let editorScriptLoaded = false;

// Javascript "enum"
// We use string and not number for values, to make it logging friendly
const EditorLoadingState = Object.freeze ({
	NotLoaded: 'NotLoaded',
	Loading: 'Loading',
	Loaded: 'Loaded',
	Initialized: 'Initialized'
});

const HtmlEditor = function({content, switchToViewMode}) {
	log.debug("HtmlEditor.render");
	expect(switchToViewMode).to.be.ok

	let intitialEditorLoadingState = EditorLoadingState.NotLoaded;
	if (editorScriptLoaded === true) {
		intitialEditorLoadingState = EditorLoadingState.Loaded;
	}

	// One of notLoaded, loading, loaded, initialized
	// In typescript, this would have been an enum...
	const [editorLoadingState, setEditorLoadingState] = useState(intitialEditorLoadingState)

	if(editorLoadingState === EditorLoadingState.NotLoaded) {
		setEditorLoadingState(EditorLoadingState.Loading);
		loadScriptFromURLAsync('https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.2.0/tinymce.min.js').then(() => {
			editorScriptLoaded = true;
			setEditorLoadingState(EditorLoadingState.Loaded);
		});
	}

  const handleInit = () => {
    log.debug("HtmlEditor.handleInit");

		setEditorLoadingState(EditorLoadingState.Initialized);
		return;
  };

	const handleEditorChange = (e) => {
    log.debug("HtmlEditor.handleEditorChange");

		const updatedContent = e.target.getContent();
    log.debug(`content=${updatedContent}`);
		
		// No need to wait for it to complete, the editor calls us any way after every change 
		globalConfig.setAsync('content', updatedContent);
		return;
  };
	
	const toolbar = `read | undo redo | code | formatselect removeformat | bold italic underline forecolor backcolor | media | link unlink |  
alignleft aligncenter alignright alignjustify | 
bullist numlist | ltr rtl | outdent indent | toc`;
	
  const init = {
    height: "100%",
    menubar: false,
    statusbar: false,
    branding: false,
    plugins: ['preview advlist autolink lists link image charmap print anchor directionality', 'searchreplace visualblocks code fullscreen toc', 'insertdatetime media table paste code'],
    toolbar: toolbar,
    default_link_target: "_blank",
    // Will not display the target list.
    // Links will always open in a new tab, unless it's a link to a view in this base,
    // in which case our onclick hander will set the active view in the current tab via the Airtable api.
    target_list: false,
		valid_elements: "*[*]",
		// Disables the table of contents default border
    content_style: myMceStyles,
    setup: (editor) => {

			// Add the switch to view mode button
			editor.ui.registry.addButton('read', {
				icon: 'preview',
				tooltip: 'Switch to read mode',
				onAction: function () {
					switchToViewMode();
				}
			});
	
			// Add an on click hander to intercept clicks on links to current base
      return editor.on('click', (event) => {
				log.debug('HtmlEditor.onclick');
				
				// We only intercept navigation interactions, which are clicks with the Control key pressed
        if (!event.ctrlKey === true) {
          return;
        }
        return NavigationInterceptor(event);
      });
    }
	};
	
	if ( ! editorScriptLoaded ) {
		return <LoadingSpinner />;
	}

  return <Fragment>
			{editorLoadingState === EditorLoadingState.Loaded ? <LoadingSpinner /> : null} 
			<Box as='main' overflow='hidden' top='0'>
				<Editor value={content} init={init} onInit={handleInit} onChange={handleEditorChange} />
			</Box>
		</Fragment>;
};

// import {clearGlobalConfig} from './Superblocks';
// clearGlobalConfig(['settings', 'content']).then( () => {
	initializeBlock(() => {return <SuperblockWrapper><EazydocsBlock /></SuperblockWrapper>;});
// });
