
import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { faSearch, faCircleNotch, faFolder, faFolderOpen, faCoffee, faSync } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { TreeModel, ITreeOptions, TREE_ACTIONS, IActionMapping } from 'angular-tree-component';

import { AppComponent } from '../app.component';
import { DataService } from '../data.service';
import { ItemtreeType, ItemDetailsType } from '../interfaces';
import {SharedService} from '../shared.service';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [AppComponent, DataService]
})
export class ItemsComponent implements OnInit {

  faSearch = faSearch;
  faCircleNotch = faCircleNotch;
  faFolder = faFolder;
  faFolderOpen = faFolderOpen;
  faSync = faSync;

  itemcount = 0;
  itemtree: ItemtreeType;
  itemdetails: ItemDetailsType = <ItemDetailsType>{};
  itemdetailsloaded = false;

  item_val: any;
  alertText = '';

  Object = Object;
  JSON = JSON;

  selectedNode;



  options: ITreeOptions = {
    useCheckbox: false,
    useTriState: false,
    childrenField: 'nodes',
    displayField: 'path'
  };


  actionMapping: IActionMapping = {
    mouse: {
      dblClick: (tree, node, $event) => // Open a modal with node content,
        $('#tree_detail').text('XXX'),
    },
  };


  update_age = '';
  change_age = '';
  previous_update_age = '';
  previous_change_age = '';

  modalRef: BsModalRef;
  constructor(private http: HttpClient,
              private dataService: DataService,
              private appComponent: AppComponent,
              private translate: TranslateService,
              private modalService: BsModalService,
              public shared: SharedService) {
  }


  static resizeItemTree() {
    const browserHeight = $(window).height();
    const tree = $('#tree');
    const treeDetail = $('#tree_detail');
    // const offsetTop = tree.offset().top;
    // const offsetTopDetail = treeDetail.offset().top;
    // initially offsetTop is off by a number of pixels. Correction: a fixed offset
    const offsetTop = 167;
    const offsetTopDetail = 200;
    const height = String(Math.round((-1) * (offsetTop) - 35 + browserHeight) + 'px');
    const heightDetail = String(Math.round((-1) * (offsetTopDetail) - 35 + browserHeight) + 'px');
    tree.css('height', height);
    tree.css('maxHeight', height);
    treeDetail.css('height', heightDetail);
    treeDetail.css('maxHeight', heightDetail);
  }


  ngOnInit() {
    console.log('ngOnInit ItemsComponent:');


    this.dataService.getItemtree()
      .subscribe(
        (response: [number, ItemtreeType]) => {
          console.log('ItemsComponent:');
          console.log(response);
          if (!this.dataService.getconfigItemtreeFullpath()) {
            this.options.displayField = 'nodename';
          }
          this.itemcount = response[0];
          this.itemtree = response[1];
          // this.plugininfo.sort(function (a, b) {return (a.pluginname > b.pluginname) ? 1 : ((b.pluginname > a.pluginname) ? -1 : 0)});
        },
        (error) => {
          console.log('ERROR: ItemsComponent: dataService.getItemtree():');
          console.log(error)
        }
      );

    window.addEventListener('resize', ItemsComponent.resizeItemTree, false);
    ItemsComponent.resizeItemTree();

  }


  closeAlert(myalert, item_oldvalue) {
    this.item_val.value = item_oldvalue;
    myalert.hide();
  }


  updateValue(item_path, item_value, item_type, item_oldvalue, dialog) {

    console.log('updateValue:');

    if (item_type === 'num' || item_type === 'scene') {
      if (isNaN(item_value.value as any)) {
        this.item_val = item_value
        this.alertText = this.translate.instant('ITEMS.ALERT.NOT NUMERIC');
        dialog.show();
        return;
      }
      if (item_type === 'scene' && (item_value.value < 0 || item_value.value > 63)) {
        this.item_val = item_value
        this.alertText = this.translate.instant('ITEMS.ALERT.INVALID SCENE NUMBER');
        dialog.show();
        return;
      }
    }
    console.log('--> updateValue: ' + item_value.value);
    if (this.dataService.getHostIp() !== 'localhost:4200') {
      this.dataService.changeItemValue(item_path, item_value.value)
        .subscribe(
          (response: ItemDetailsType[]) => {
            console.log('updateValue:');
            console.log({response});
          },
          (error) => {
            console.log('ERROR: ItemsComponent: dataService.updateValue():');
            console.log(error)
          }
        );
    }
  }


/*

      $("#item_value" ).on('blur change', function() {
        $.ajax({
          url: 'item_change_value.html',
          type: 'POST',
          data: {
            'item_path': element.path,
            'value': $("#item_value").val()
          },
          success: function (response) {
            $( ".fa-sync" ).trigger( "click" );
          },
          error: function () {
            //your error code
          }
        });
      });
  */


  getDetails(path) {
    console.log('getDetails: ' + path);
    if ((this.dataService.getHostIp() !== 'localhost:4200') || (path === 'beoremote.beo4command')) {
      this.dataService.getItemDetails(path)
        .subscribe(
          (response: ItemDetailsType[]) => {
            console.log('ItemsComponent:');
            console.log(response);
            this.itemdetails = response[0];
            this.itemdetailsloaded = true;

            this.update_age = this.shared.ageToString(this.itemdetails.update_age);
            this.change_age = this.shared.ageToString(this.itemdetails.change_age);
            this.previous_update_age = this.shared.ageToString(this.itemdetails.previous_update_age);
            this.previous_change_age = this.shared.ageToString(this.itemdetails.previous_change_age);
            },
          (error) => {
            console.log('ERROR: ItemsComponent: dataService.getItemDetails():');
            console.log(error)
          }
          );
    } else {
      this.itemdetails = <ItemDetailsType>{};
      this.itemdetails.config = {};
//      this.itemdetails.path = path;
//      this.itemdetails.name = event.node.data.name;
      this.itemdetailsloaded = true;
    }

  }


  filterTree(treeModel, value) {
    if (value.length >= this.dataService.getconfigItemtreeSearchstart() || value.length === 0) {
      treeModel.filterNodes(value);
    }
  }


  clearFilter(treeModel, filter) {
    treeModel.clearFilter();
    filter.value = '';
  }
/*
  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => fuzzysearch(value, node.data.name));
  }
*/

}



function fuzzysearch (needle: string, haystack: string) {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hlen = haystack.length;
  const nlen = needleLC.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hlen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}


/*


function reload(item_path) {
    if (item_path) {
        $('#refresh-element').addClass('fa-spin');
        $('#reload-element').addClass('fa-spin');
        $('#cardOverlay').show();
        $.getJSON('item_detail_json.html?item_path='+item_path, function(result) {
            getDetailInfo(result);
            window.setTimeout(function(){
                $('#refresh-element').removeClass('fa-spin');
                $('#reload-element').removeClass('fa-spin');
                $('#cardOverlay').hide();
            }, 300);

        });
    }
}

var selectedNode;

function getTree() {
    var item_tree = [];

    $.getJSON('items-v1.json?mode=tree', function(result) {
        $.each(result, function(index, element) {
            item_tree.push(build_item_subtree_recursive(element));
        });

        $('#tree').treeview({
            data: item_tree,
			levels: 1,
			expandIcon: 'plusIcon',
		    collapseIcon: 'minusIcon',
			selectedBackColor: '#709cc2',
            showTags: true,
            onNodeSelected: function(event, node) {
                selectedNode = node;
                reload(node.text);
            }
        });

        function clearSearch() {
            $('#btn-clear-search').on('click', function (e) {
                $('#tree').treeview('clearSearch');
                $('#tree').treeview('collapseAll', { silent: false });
                $('#input-search').val('');
                $('#search-output').html('');
                results = [];
                $('#search-results').html('');
            });
        };

        var search = function(e) {
            results = [];
            var pattern = $('#input-search').val();
            var options = {
                ignoreCase: true,
                exactMatch: false,
                revealResults: true
            };
            var results = $('#tree').treeview('search', [ pattern, options ]);
            if ($('#input-search').val() != "") {
                $('#search-results').html(' - Treffer: '+results.length);
            }
            clearSearch();
        }

        var searchExact = function(e) {
            results = [];
            var pattern = $('#input-search').val();
            var options = {
                ignoreCase: true,
                exactMatch: true,
                revealResults: true
            };
            var results = $('#tree').treeview('search', [ pattern, options ]);
            if ($('#input-search').val() != "") {
                $('#search-results').html(' - Treffer: '+results.length);
            }
            clearSearch();
        }

        $('#btn-search').on('click', search);
        $("#input-search").keypress(function(event){
            if(event.keyCode == 13){
                $("#btn-search").click();
            }
        });

        // Expand/collapse all
        $('#btn-expand-all').on('click', function (e) {
          $('#tree').treeview('expandAll', { silent: false });
        });
        $('#btn-collapse-all').on('click', function (e) {
          $('#tree').treeview('collapseAll', { silent: false });
        });

        if ($("#input-search").val() != "") {
            searchExact();
        }
    });
}

 */

