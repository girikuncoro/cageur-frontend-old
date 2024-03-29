import {Pipe, PipeTransform} from '@angular/core';

const Folders = [
  {'name': 'Sent Message', 'order': 0, 'id': 1, 'unread': 2},
  {'name': 'Scheduled', 'order': 6, 'id': 2, 'unread': 0},
  {'name': 'Inbox', 'order': 7, 'id': 3, 'unread': 3},
  {'name': 'Trash', 'order': 8, 'id': 4, 'unread': 0}
];

@Pipe({
  name: 'FoldersPipe'
})
export class FoldersPipe implements PipeTransform {

  folders = Folders;

  transform(value, args?): Array<any> {
    let folderName = args;
    if (value) {
      return value.filter(conversation => {
        /* tslint:disable */
        if (folderName == 'Starred') {

          return conversation.starred;
        } else {

          let folder =  this.folders.filter(folder => folder.name == folderName);

          return folder[0].id == conversation.folderId;
          /* tslint:enable */
        }
      });
    }
  }
}
