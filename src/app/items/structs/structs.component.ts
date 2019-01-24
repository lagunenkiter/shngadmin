
import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';


import { StructsApiService } from '../../common/services/structs-api.service';
import { ItemTree } from '../../common/models/item-tree';
import {PlugininfoType} from '../../common/models/plugin-info';
import { SystemInfo } from '../../common/models/system-info';
import { SceneInfo } from '../../common/models/scene-info';




@Component({
  selector: 'app-structs',
  templateUrl: './structs.component.html',
  styleUrls: ['./structs.component.css']
})
export class StructsComponent implements OnInit {

// ----

  structsDict: {};
  structsList: string[];
  selectedItem: TreeNode;
  displayTree: TreeNode[];
  displayTrees: {};
  structExpanded: {};


  // systeminfo: SystemInfo = <SystemInfo>{};


  constructor(private http: HttpClient,
              private translate: TranslateService,
              private dataService: StructsApiService) { }


  ngOnInit() {
    console.log('StructsComponent.ngOnInit');

    this.displayTrees = {};
    this.structExpanded = {};
    this.dataService.getStructs()
      .subscribe(
        (response) => {
          this.structsDict = <any>response;
//          this.schedulerinfo.sort(function (a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)});
          this.structsList = [];
          for (const k in this.structsDict) {
            if (k in this.structsDict) {
              this.structsList.push(k);
              this.displayTree = this.buildDisplayTree(this.structsDict[k]);
              this.displayTrees[k] = this.displayTree;
            }
          }
          console.log('getStructs', {response});
        }
      );
  }

  // -------------------------------------------------------------------------------------------
  // build a display tree for the PrimeNG component from the itemtree received from the backend
  //
  buildDisplayTree(subtree) {
    const displayTreeList = [];
    for (const key in subtree) {
      if (key in subtree) {
        const displayNode = {};
        if (Array.isArray(subtree)) {
          displayNode['label'] = '- ' + subtree[key];
        } else {
          if (typeof subtree[key] === 'string') {
            displayNode['label'] = key + ': ' + subtree[key];
          } else {
            displayNode['label'] = key;
          }
        }
        if (typeof subtree[key] === 'object') {
          displayNode['children'] = this.buildDisplayTree(subtree[key]);
        }
        displayTreeList.push(displayNode);
      }
    }
    return displayTreeList;
  }


  expandAll(tree) {
    tree.forEach( node => {
      this.expandRecursive(node, true);
    } );
  }

  collapseAll(tree) {
    tree.forEach( node => {
      this.expandRecursive(node, false);
    } );
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach( childNode => {
        this.expandRecursive(childNode, isExpand);
      } );
    }
  }

}
