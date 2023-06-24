import { create } from 'zustand';
import { columnInterface, rowType } from './constants/interfaces';
import { devtools } from 'zustand/middleware';

export interface zustandStoreInterface {
  whenRowData: any[];
  rowDataType: any[];
  whenColDefs: columnInterface[];
  thenRowData: any[];
  thenColData: columnInterface[];
  pinnedColumn: any;
  mode: 'light' | 'dark';
  setPinnedColumn: (colId: string) => void;
  editRowData: (core: any, rowIndex: any, colId: any, value: any) => void;
  editRowDataType: (core: any, rowIndex: any, colId: any, value: any) => void;
  addRow: (whenColData: any, thenColData: any) => void;
  setWhenColDefs: (whenColData: any) => void;
  editWhenCol: (updatedDef: any) => void;
  duplicateRule: (id: number) => void;
  deleteRule: (id: number) => void;
  clearRule: (id: number) => void;
  setMode: (mode: 'light' | 'dark') => void;
}

export const useStore = create<
  zustandStoreInterface,
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    whenColDefs: [],
    rowDataType: [],
    whenRowData: [
      {
        button: 'Add Rule',
      },
    ],
    thenColData: [],
    thenRowData: [],
    pinnedColumn: null,
    mode: 'light',
    setMode: (mode) =>
      set((store) => ({
        mode: mode,
      })),
    duplicateRule: (id) =>
      set((store) => {
        const whenRowData = [...store.whenRowData];
        const duplicatedRow = {
          ...whenRowData[id - 1],
          any: store.whenRowData.length,
        };
        whenRowData.splice(whenRowData.length - 1, 0, duplicatedRow);

        return {
          ...store,
          whenRowData,
        };
      }),

    clearRule: (id) =>
      set((store) => {
        const allrowdata = store.rowDataType.filter(
          (value) => value.rowIndex !== id - 1
        );

        return {
          whenRowData: store.whenRowData.map((data) => {
            if (data.any === id) {
              return {
                any: data.any,
                [data]: '',
              };
            }
            return data;
          }),
          rowDataType: allrowdata,
        };
      }),

    deleteRule: (id) =>
      set((store) => {
        console.log('ID : ' + id);
        const allrowdata = store.rowDataType.filter(
          (value) => value.rowIndex !== id
        );

        return {
          whenRowData: store.whenRowData.filter((data) => data.any !== id - 1),
          rowDataType: allrowdata,
        };
      }),
    setWhenColDefs: (whenColData) =>
      set(
        (store) => ({
          whenColDefs: [...store.whenColDefs, whenColData],
        }),
        false,
        'Set When Col'
      ),

    editRowDataType: (core, rowIndex, colId, value) =>
      set((store) => {
        const newdata = [];
        const storedata = store.rowDataType;
        const existingindex = store.rowDataType?.findIndex(
          (item: any) => item.key === colId && item.rowIndex === rowIndex
        );

        if (existingindex !== -1) {
          storedata.splice(existingindex, 1);
        }

        storedata.map((item: any) => {
          newdata.push(item);
        });

        newdata.push({
          key: colId,
          value: value,
          rowIndex: rowIndex,
        });

        const updateRowData = [...newdata];

        return { rowDataType: updateRowData };
      }),

    editRowData: (core, rowIndex, colId, value) =>
      set((store) => {
        const updatedRowData = [...store.whenRowData];
        const rowToUpdate = updatedRowData[rowIndex];
        rowToUpdate[colId] = value;
        return { whenRowData: updatedRowData };
      }),

    addRow: (whenColDeta, thenColData) =>
      set((store) => {
        const newWhenRowData = [...store.whenRowData];
        const newThenRowData = [...store.thenRowData];

        const newRowData = Object.fromEntries(
          whenColDeta.map((header: any, index: number) => {
            if (header.id === 'hit') {
              return ['any', store.whenRowData.length];
            }
            return [header.field, ''];
          })
        );

        // Inserting the new row at the second-to-last position
        newWhenRowData.splice(newWhenRowData.length - 1, 0, newRowData);

        const newThenRow = Object.fromEntries(
          thenColData.map((header: any) => [header.field, ''])
        );

        newThenRowData.push(newThenRow);

        return {
          ...store,
          whenRowData: newWhenRowData,
          thenRowData: newThenRowData,
        };
      }),
    editWhenCol: (updatedDef) =>
      set(
        (store) => ({
          whenColDefs: updatedDef,
        }),
        false,
        'Edit Col'
      ),
    setPinnedColumn: (colId) =>
      set((store) => ({
        whenColDefs: store.whenColDefs.map((col) => {
          if (col.id === colId) {
            store.pinnedColumn = colId;
            return {
              ...col,
              pinned: 'left',
            };
          }
          return col;
        }),
      })),
  }))
);
