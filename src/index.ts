import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, IFrame } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { PageConfig } from '@jupyterlab/coreutils';
import { requestAPI } from './handler';
import { Panel, Widget } from '@lumino/widgets';
import {
  BasicModel,
  BasicView
} from './model';

/**
 * Initialization data for the work1 extension.
 */

/**
 * The command IDs used by the server extension plugin.
 */
 namespace CommandIDs {
  export const get = 'server:get-file';
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'work1:plugin',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null
    ) => {
    console.log('JupyterLab extension work200 is activated!');

    try {
      const data = await requestAPI<any>('hello__');
      console.log(data);
    } catch (reason) {
      console.error(`Error on GET /jlab-ext-example/hello.\n${reason}`);
    }

    //requestAPI<any>('get_example')
    // requestAPI<any>('hello')
    //   .then(data => {
    //     console.log('data',data);
    //   })
    //   .catch(reason => {
    //     console.error( `The work1 server extension appears to be missing.\n${reason}`);
    //   });



   // POST request
    const dataToSend = { name: 'man' };
    try {
      const reply = await requestAPI<any>('hello', {
        body: JSON.stringify(dataToSend),
        method: 'POST',
      });
      console.log('reply',reply);
    } catch (reason) {
      console.error(
        `Error on POST /work1/hello ${dataToSend}.\n${reason}`
      );
    }

    const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'Extension Examples';

    commands.addCommand(command, {
      label: 'Get Server Content in a IFrame Widget',
      caption: 'Get Server Content in a IFrame Widget',
      execute: () => {
        const widget = new IFrameWidget();
        shell.add(widget, 'main');
      },
    });
    palette.addItem({ command, category: category });



    const widget = new IFrameWidget();
    app.shell.add(widget, 'right');




      //const widget = new Widget({ node: createNode() });

      app.restored.then(() => {

        // Demo Model-View
        const panel = new Panel();
        panel.id = 'jupyter-ui-toolkit-demo-panel';
        const title1 = new Widget();
        title1.node.textContent = 'UsingDB';
        panel.addWidget(title1);
        const view1 = new BasicView();
        view1.model = new BasicModel();
        panel.addWidget(new Widget({ node: view1 }));

        panel.title.label = 'Demo';
        app.shell.add(panel, 'right');
      });
    }
};

// function createNode(): HTMLElement {
//   const node = document.createElement('div');
//   node.insertAdjacentHTML(
//     'afterbegin',
//     `
// <div class="jp-Grid">
//     <div class="jp-FlexColumn" style="grid-column: 1;">
//       <div class="jp-FlexRow">
//         <jp-button appearance="accent">Button</jp-button>
//         <jp-button appearance="neutral">Button</jp-button>
//         <jp-button appearance="stealth" aria-label="Confirm"><span class="fa fa-cog"></span></jp-button>
//       </div>
//     </div>
// </div>
// `
//   );

//   return node;
// }


export default plugin;

