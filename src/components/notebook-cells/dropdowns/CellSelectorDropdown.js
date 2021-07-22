import React from 'react';
import PropTypes from 'prop-types';

import CollapsedLabel from 'shared/labels/CollapsedLabel';
import Dropdown from 'shared/dropdown/Dropdown';
import { getColorForName } from 'utils/Palette';
import './CellSelectorDropdown.css';

export default class CellSelectorDropdown extends Dropdown {
  // *********************************************************
  // Static methods
  // *********************************************************
  static defaultProps = {
    selectedItem: undefined,
    selections: [],
    labelAccessor: d => d
  };

  static propTypes = {
    /**
     * The name to use for the options
     */
    name: PropTypes.string.isRequired,
    /**
     * Array of selections to show
     */
    selections: PropTypes.arrayOf(PropTypes.any),
    /**
     * The selected item
     */
    selectedItem: PropTypes.any,
    /**
     * The callback function to call when selected
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * Optional label accessor
     */
    labelAccessor: PropTypes.func,
    /**
     * Optional secondary label accessor
     */
    secondaryLabelAccessor: PropTypes.func,
    /**
     * Accessor for collapsed label
     */
    collapsedLabelAccessor: PropTypes.func
  };

  // *********************************************************
  // React methods
  // *********************************************************
  componentDidUpdate (prevProps) {
    if (prevProps.selectedItem !== this.props.selectedItem) {
      if (!this.props.selectedItem && this.props.selections.length === 1) {
        this.props.onSelect(this.props.selections[0].value);
      }
    }
  }

  render () {
    const {
      name,
      selections,
      selectedItem,
      labelAccessor,
      secondaryLabelAccessor,
      collapsedLabelAccessor
    } = this.props;
    const { open } = this.state;
    return (
      <div ref={el => (this.container = el)} className='cell-type-dropdown'>
        <CollapsedLabel
          text={
            selectedItem
              ? (collapsedLabelAccessor || labelAccessor)(selectedItem)
              : undefined
          }
          onClick={this.toggleOpen}
        />
        {open && (
          <React.Fragment>
            <ul className='cell-type-dropdown__list'>
              <li
                className='cell-type-dropdown__list-item'
                style={{
                  textAlign: 'center'
                }}
              >
                {name}
              </li>
              {selections.map((selection, i) => {
                return (
                  <li
                    className='cell-type-dropdown__list-item'
                    key={i}
                    onClick={this.onSelect.bind(null, selection.value)}
                  >
                    <span className='cell-type-dropdown__list-item-label'>
                      {labelAccessor(selection)}
                    </span>
                    {secondaryLabelAccessor && (
                      <span
                        className='cell-type-dropdown__list-item-icon'
                        style={{
                          color: getColorForName(
                            secondaryLabelAccessor(selection)
                          )
                        }}
                      >
                        {secondaryLabelAccessor(selection)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        )}
      </div>
    );
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  onSelect = option => {
    this.toggleOpen();
    this.props.onSelect(option);
  };
}
