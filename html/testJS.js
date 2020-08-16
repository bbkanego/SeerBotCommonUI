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
    const targClass = tarElem.attr('class');
    console.log(targClass);
    if ('nodeItem' === targClass) {
      tarElem = tarElem.parent('li');
      const targClass2 = tarElem.attr('class');
      console.log(targClass2);
    }
    addNodeHtml(tarElem, treeNodeParent);
  })
});

function addNodeHtml(container, treeNode) {
  const ulObject = $('<ul class="list-group"></ul>');
  const liObject = $('<li class="list-group-item ' +
    'list-node fa fa-plus"><span class="nodeItem">' + treeNode.label + '</span></li>');
  ulObject.append(liObject);
  const parent = $(container);
  parent.append(ulObject);
  parent.removeClass('fa-plus').addClass('fa-minus');
  for (let i = 0; i < treeNode.children.length; i++) {
    addNodeHtml(liObject, treeNode.children[i]);
/*
    const html = '<ul class="list-group"><li class="list-group-item list-node fa fa-plus"><span class="nodeItem">' + treeNodeParent.children[i].label + '</span></li></ul>';
    $('#parentNode').append(html);
*/
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
