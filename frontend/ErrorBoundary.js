import log from 'loglevel';
log.setLevel('info');

import React, {
  Component,
} from 'react';

import {
	Box,
	Text,
	Button,
	Link
} from '@airtable/blocks/ui';


export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    log.error(error, errorInfo);
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
				<Box position='fixed' display='flex' flexDirection='column' width='100vw' height='calc(100vh - 24px)' top='0' justifyContent='center' alignItems='center'>
          <Text size="xlarge">Oops, something went wrong.</Text>
					<Text size="xlarge">Please contact <Link size="xlarge" href="mailto:support@superblocks.at">support@superblocks.at</Link> if the problem persists.</Text>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', marginBottom: '10px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
					<Button
						onClick={() => location.reload() }
						variant="primary"
						icon="redo"
					>
						Reload Block
					</Button>
				</Box>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}
