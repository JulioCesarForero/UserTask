/**
 * @Category React Hook function
 * Provide single source to manage application static menus items
 * 
**/




export default function useMenus() {
    
    
    return {
	navbarTopRight: [],
	navbarSideLeft: [
  {
    "to": "/home",
    "label": "Home",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/notes",
    "label": "Notes",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/taskpriorities",
    "label": "Task Priorities",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/tasks",
    "label": "Tasks",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/taskstatuses",
    "label": "Task Statuses",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  },
  {
    "to": "/users",
    "label": "Users",
    "icon": "pi pi-th-large",
    "iconcolor": "",
    "target": "",
  }
],
        exportFormats: {
            print: {
                label: 'Print',
                icon: 'pi pi-print',
                type: 'print',
                ext: '',
            },
            pdf: {
                label: 'Pdf',

                icon: 'pi pi-file-pdf',
                type: 'pdf',
                ext: 'pdf',
            },
            excel: {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                type: 'excel',
                ext: 'xlsx',
            },
            csv: {
                label: 'Csv',
                icon: 'pi pi-table',
                type: 'csv',
                ext: 'csv',
            },
        },
    }
}