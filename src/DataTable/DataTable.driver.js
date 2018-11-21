import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import values from 'lodash/values';

const arbitraryEmptyElement = () => document.createElement('div');

const dataTableDriverFactory = ({element, wrapper, component}) => {
  // When a React component renders null in React 15, a Comment-Element is rendered to the DOM.
  const isDisplayingNothing = !element || element.nodeType === Node.COMMENT_NODE;
  /* Since a Comment-Element has no methods like querySelector(),
   * we replace (if needed) it with an arbitrary Element.
   * This allows simple implementation of methods like getRows().
   */
  element = isDisplayingNothing ? arbitraryEmptyElement() : element;

  const getHeader = () => element.querySelector('thead');
  const hasHeader = () => !!getHeader();

  const getRows = () => element.querySelectorAll('tbody tr[data-table-row="dataTableRow"]');
  const getRowsCount = () => getRows().length;
  const getRow = rowIndex => getRows()[rowIndex];
  const getCell = (rowIndex, cellIndex) => getRow(rowIndex).querySelectorAll('td')[cellIndex];
  const getRowDetails = index => element.querySelector(`tbody tr td[data-hook="${index}_details"]`);
  const getHeaderCell = index => getHeader().querySelectorAll('th')[index];
  const getSortableTitle = index => element.querySelector(`th [data-hook="${index}_title"]`);
  const getTitleInfoIcon = index => element.querySelector(`th [data-hook="${index}_info_tooltip"]`);
  const getSortableTitleArrowDesc = index => element.querySelector(`th [data-hook="${index}_title"]  [data-hook="active_arrow_desc"]`);

  const getSortingIconsDataHooks = index =>
    Array.from(element.querySelectorAll(`th [data-hook="${index}_title"] svg`))
      .map(el => el.getAttribute('data-hook') || '');

  return {
    getRow,
    getRowsCount,
    getRowsWithClassCount: className => {
      return isDisplayingNothing ? 0 :
        values(getRows()).filter(elem => elem.classList.contains(className)).length;
    },
    getRowsWithDataHook: dataHookName => element.querySelectorAll(`[data-hook="${dataHookName}"]`),
    getRowWithDataHook: dataHookName => element.querySelector(`[data-hook="${dataHookName}"]`),
    /** Returns an array representing the text content of the cells in a given row `index`.  */
    getRowText: index => values(getRows()[index].querySelectorAll('td')).map(td => td.textContent),
    getRowClasses: index => values(getRows()[index].classList),
    /** Get header cell element: (columnIndex) => Element */
    getHeaderCell,
    getHeaderCellStyle: index => getHeaderCell(index).style,
    getHeaderCellWidth: index => getHeaderCell(index).style.width,
    /** Get cell element: (rowIndex, columnIndex) => Element */
    getCell,
    getCellStyle: (rowIndex, colIndex) => getCell(rowIndex, colIndex).style,
    getCellWidth: (rowIndex, colIndex) => getCell(rowIndex, colIndex).width,
    isRowClickable: index => getRows()[index].classList.contains('clickableDataRow'),
    isRowAnimated: index => getRows()[index].classList.contains('animatedDataRow'),
    getTitles: () => values(getHeader().querySelectorAll('th')).map(th => th.textContent),
    isDisplayingNothing: () => isDisplayingNothing,
    isDisplayingHeaderOnly: () => hasHeader() && getRowsCount() === 0,
    isDisplayingHeader: () => hasHeader(),
    hasChildWithId: id => !!element.querySelector(`#${id}`),
    clickRow: (index, eventData) => ReactTestUtils.Simulate.click(getRow(index), eventData),
    mouseEnterRow: (index, eventData) => ReactTestUtils.Simulate.mouseEnter(getRow(index), eventData),
    mouseLeaveRow: (index, eventData) => ReactTestUtils.Simulate.mouseLeave(getRow(index), eventData),
    setProps: props => {
      const ClonedWithProps = React.cloneElement(component, Object.assign({}, component.props, props), ...(component.props.children || []));
      ReactDOM.render(<div ref={r => element = r}>{ClonedWithProps}</div>, wrapper);
    },
    hasRowDetails: index => !!getRowDetails(index),
    getRowDetailsText: index => getRowDetails(index).textContent,
    hasSortableTitle: index => !!getSortableTitle(index),
    hasInfoIcon: index => !!getTitleInfoIcon(index),
    hasNewSortDescending: index => !!getSortableTitleArrowDesc(index),
    hasSortDescending: index => {
      const sortableTitle = getSortableTitle(index);
      return !!sortableTitle && sortableTitle.classList.contains('sortArrowAsc');
    },
    clickSort: (index, eventData) => ReactTestUtils.Simulate.click(getHeaderCell(index), eventData),
    getRowDetails: index => getRowDetails(index),

    // New sorting arrows
    getActiveSortingArrowDirection: index => {
      const hooks = getSortingIconsDataHooks(index);
      const activeIconDataHook = hooks.find(h => h.includes('active'));

      return activeIconDataHook && /active_arrow_(.+)$/.exec(activeIconDataHook)[1];
    },
    getHiddenSortingArrowDirection: index => {
      const hooks = getSortingIconsDataHooks(index);
      const activeIconDataHook = hooks.find(h => h.includes('hidden'));

      return activeIconDataHook && /hidden_arrow_(.+)$/.exec(activeIconDataHook)[1];
    },
    mouseEnterHeaderCell: (index, eventData) => ReactTestUtils.Simulate.mouseEnter(getHeaderCell(index), eventData),
    mouseLeaveHeaderCell: (index, eventData) => ReactTestUtils.Simulate.mouseLeave(getHeaderCell(index), eventData)
  };
};

export default dataTableDriverFactory;
