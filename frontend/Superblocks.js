import log from 'loglevel';
log.setLevel('info');

// import chai from 'chai';
// const expect = chai.expect;
import ErrorBoundary from './ErrorBoundary'

import React, {
  Fragment,
} from 'react';

import {
  globalConfig
} from '@airtable/blocks';

import {
  loadCSSFromString,
  Box,
  Link,
  Text
} from '@airtable/blocks/ui';


const css = `body {
  min-height: 100vh;
  max-height: 100vh;
  margin: 0px;
  padding: 0px;
	overflow: hidden;
}

main {
  position: fixed;
	left: 0;
	bottom: 24px;
	width: 100%;
  box-sizing: border-box;
}

footer {
  position: fixed;
  overflow: hidden;
  height: 24px;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
  bottom: 0;
  left: 0;
  width: 100%;
}

#logoLink:active, #logoLink:focus {
	box-shadow: none !important;
}

#logoLink {
	opacity: 1 !important;
}

#logoLink:hover {
	opacity: 0.75 !important;
}`;

loadCSSFromString(css);


export const SuperblockFooter = function() {
	log.debug('SuperblockFooter.render');
	
  return <footer>
			<Box display="flex" height='24px' justifyContent='flex-end' alignItems='center' paddingRight={2}>
				<Text display="inline-block" as="span" textColor="gray" marginRight={1} style={{
    verticalAlign: 'middle'
  }}> Powered by </Text>
				<Link id="logoLink" href="https://superblocks.at" target="_blank">
					<img style={{
    maxHeight: '16px',
    verticalAlign: 'middle'
  }} src='https://superblocks.at/superblocks-domain-logo-2/' />
				</Link>
			</Box>
		</footer>;
};


export const SuperblockWrapper = function({children}) {
	log.debug('SuperblockWrapper.render');
	
  return <ErrorBoundary>
			{children}
			<SuperblockFooter />
		</ErrorBoundary>;
};


// TODO Move to setPathsAsync now that docuemntation on how to use it exists
export const clearGlobalConfig = function(keys) {
  log.debug("clearGlobalConfig");
  log.info('Clearing GlobalConfig');
  const promises = [];
  for (let i = 0; i < keys.length; i++) {
    promises.push(globalConfig.setAsync(keys[i], undefined));
  }
  return Promise.all(promises);
};
