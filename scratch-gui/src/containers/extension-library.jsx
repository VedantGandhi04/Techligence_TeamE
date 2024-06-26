import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';
import analytics from '../lib/analytics'; // Additional import for analytics

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unofficial extension URL',
        id: 'gui.extensionLibrary.extensionUrl'
    }
});

class ExtensionLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
    }

    handleItemSelect(item) {
        const id = item.extensionId;
        let url = item.extensionURL ? item.extensionURL : id;
        if (!item.disabled && !id) {
            url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
        }
        if (id && !item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
                this.props.onCategorySelected(id);
            } else {
                this.props.vm.extensionManager.loadExtensionURL(url).then(() => {
                    this.props.onCategorySelected(id);
                });
            }
        }
        
        // Event tracking using analytics
        let gaLabel = '';
        if (typeof (item.name) === 'string') {
            gaLabel = item.name;
        } else {
            gaLabel = item.name.props.defaultMessage;
        }
        analytics.event({
            category: 'library',
            action: 'Select Extension',
            label: gaLabel
        });
    }

    render() {
        const extensionLibraryThumbnailData = extensionLibraryContent.map(extension => ({
            rawURL: extension.iconURL || extensionIcon,
            ...extension
        }));
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={false}
                id="extensionLibrary"
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(ExtensionLibrary);
