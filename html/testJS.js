let treeNodeParent = null;
$(function () {
  treeNodeParent = new TreeNode();
  treeNodeParent.code = 'PAR23232323';
  treeNodeParent.label = 'Parent Node';
  treeNodeParent.createTree(10);
  // alert('hi = ' + treeNodeParent.children.length);

  const treeContainer = $('#treeContainer');
  addNodeHtml(treeContainer, treeNodeParent);

  $('.list-node').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    let tarElem = $(event.target);
    if (tarElem.hasClass('nodeIcon') || tarElem.hasClass('nodeItem')) {
      return;
    }
    const targClass = tarElem.attr('class');
    console.log('The class is = ' + targClass);
    let expanded = tarElem.hasClass('fa-minus');
    if ('nodeItem' === targClass) {
      tarElem = tarElem.parent('li');
      const targClass2 = tarElem.attr('class');
      expanded = tarElem.hasClass('fa-minus');
      console.log('The class is 2 = ' + targClass2);
    }
    const ulChildren = tarElem.children('ul');
    console.log('The current children are: ' + ulChildren.length);
    if (!expanded) {
      if (ulChildren.length === 0) {
        addNodeHtmlFromChildren(tarElem, treeNodeParent.children);
      } else {
        ulChildren.show();
        tarElem.removeClass('fa-plus').addClass('fa-minus');
        tarElem.children('.nodeIcon').removeClass('fa-folder').addClass('fa-folder-open');
      }
    } else {
      ulChildren.hide();
      tarElem.removeClass('fa-minus').addClass('fa-plus');
      tarElem.children('.nodeIcon').removeClass('fa-folder-open').addClass('fa-folder');
    }
  });
});

function addNodeHtmlFromChildren(container, treeNodeArray) {
  for (let i = 0; i < treeNodeArray.length; i++) {
    const currentTreeNode = treeNodeArray[i];
    const ulObject = $('<ul class="list-group"></ul>');
    const liObject = $('<li class="list-group-item ' +
      'list-node fa fa-plus"><span class="nodeIcon fa fa-folder"></span><span class="nodeItem">' + currentTreeNode.label + '</span></li>');
    ulObject.append(liObject);
    const parent = $(container);
    parent.append(ulObject);
    parent.removeClass('fa-plus').addClass('fa-minus');
    parent.children('.nodeIcon').removeClass('fa-folder').addClass('fa-folder-open');

    if (currentTreeNode.children || currentTreeNode.children.length > 0) {
      addNodeHtmlFromChildren(liObject, currentTreeNode.children);
    }
  }
}

function addNodeHtml(container, treeNode) {
  const ulObject = $('<ul class="list-group"></ul>');
  const liObject = $('<li class="list-group-item ' +
    'list-node fa fa-plus"><span class="nodeItem">' + treeNode.label + '</span></li>');
  ulObject.append(liObject);
  const parent = $(container);
  parent.append(ulObject);
  parent.removeClass('fa-plus').addClass('fa-minus');
  for (let i = 0; i < treeNode.children.length; i++) {
    addNodeHtmlFromChildren(liObject, treeNode.children);
  }
}

class TreeNode {
  id;
  code;
  label;
  children = [];

  createTree(depth) {
    let depthCount = depth;
    for (let i = 0; i < 10; i++) {
      const treeNode = new TreeNode();
      treeNode.code = 'CODE' + i;
      treeNode.id = 'ID' + i;
      treeNode.label = 'label:' + (i + 1);
      this.children.push(treeNode);
      if (depthCount > 0) {
        //treeNode.createTree(depthCount);
        depthCount = depthCount - 1;
      }
    }
  }
}
