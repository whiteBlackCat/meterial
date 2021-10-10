var sort = {
  // 希尔排序是在插入排序上面做的升级。是先跟距离较远的进行比较的一些方法
  shell: function (arr) {
    var i, k, j, len = arr.length,
      gap = Math.ceil(len / 2), // 步长
      temp;
    while (gap > 0) {
      for (var k = 0; k < gap; k++) {
        var tagArr = [];
        tagArr.push(arr[k])
        for (i = k + gap; i < len; i += gap) {
          temp = arr[i];
          tagArr.push(temp);
          for (j = i - gap; j > -1; j -= gap) {
            if (arr[j] > temp) {
              arr[j + gap] = arr[j];
            } else {
              break;
            }
          }
          arr[j + gap] = temp;
        }
        console.log(tagArr, "gap:" + gap); //输出当前进行插入排序的数组。 
        console.log(arr); //输出此轮排序后的数组。 
      }
      gap = parseInt(gap / 2);
    }
    return arr;
  },
  // 快速排序。把一个数组以数组中的某个值为标记。比这个值小的放到数组的左边，比这个值得大的放到数组的右边。然后再递归 对左边和右边的数组进行同样的操作。直到排序完成。通常以数组的第一个值为标记。
  quick: function quickSort(arr) {
    var len = arr.length,
      leftArr = [],
      rightArr = [],
      tag;
    if (len < 2) {
      return arr;
    }
    tag = arr[0];
    for (i = 1; i < len; i++) {
      if (arr[i] <= tag) {
        leftArr.push(arr[i])
      } else {
        rightArr.push(arr[i]);
      }
    }
    return quickSort(leftArr).concat(tag, quickSort(rightArr));
  },
  // 归并排序。把一系列排好序的子序列合并成一个大的完整有序序列。从最小的单位开始合并。然后再逐步合并合并好的有序数组。最终实现归并排序。 
  merge: function (arr) {
    var len = arr.length,
      arrleft = [],
      arrright = [],
      gap = 1,
      maxgap = len - 1,
      gapArr = [],
      glen, n = 0;
    while (gap < maxgap) {
      gap = Math.pow(2, n);
      if (gap <= maxgap) {
        gapArr.push(gap);
      }
      n++;
    }
    glen = gapArr.length;
    for (var i = 0; i < glen; i++) {
      gap = gapArr[i];
      for (var j = 0; j < len; j += gap * 2) {
        arrleft = arr.slice(j, j + gap);
        arrright = arr.slice(j + gap, j + gap * 2);
        console.log("left:" + arrleft, "right:" + arrright);
        arr = arr.slice(0, j).concat(subSort(arrleft, arrright), arr.slice(j + gap * 2));
      }
    }
    return arr;

    function subSort(arr1, arr2) {
      var arr3 = [],
        bArr1 = arr1.slice(),
        bArr2 = arr2.slice();
      while (bArr1.length != 0 || bArr2.length != 0) {
        if (bArr1.length == 0) {
          arr3 = arr3.concat(bArr2);
          bArr2.length = 0;
        } else if (bArr2.length == 0) {
          arr3 = arr3.concat(bArr1);
          bArr1.length = 0;
        } else {
          if (bArr1[0] <= bArr2[0]) {
            arr3.push(bArr1[0]);
            bArr1.shift();
          } else {
            arr3.push(bArr2[0]);
            bArr2.shift();
          }
        }
      }
      return arr3;
    }
  },
  // 堆排序
  heap: function (elements) {
    //调整函数
    function headAdjust(elements, pos, len) {
      //将当前节点值进行保存
      var swap = elements[pos];
      //定位到当前节点的左边的子节点
      var child = pos * 2 + 1;
      //递归，直至没有子节点为止
      while (child < len) {
        //如果当前节点有右边的子节点，并且右子节点较大的场合，采用右子节点
        //和当前节点进行比较
        if (child + 1 < len && elements[child] < elements[child + 1]) {
          child += 1;
        }
        //比较当前节点和最大的子节点，小于则进行值交换，交换后将当前节点定位
        //于子节点上
        if (elements[pos] < elements[child]) {
          elements[pos] = elements[child];
          pos = child;
          child = pos * 2 + 1;
        } else {
          break;
        }
        elements[pos] = swap;
      }
    }
    //构建堆
    function buildHeap(elements) {
      //从最后一个拥有子节点的节点开始，将该节点连同其子节点进行比较，
      //将最大的数交换与该节点,交换后，再依次向前节点进行相同交换处理，
      //直至构建出大顶堆（升序为大顶，降序为小顶）
      for (var i = elements.length / 2; i >= 0; i--) {
        headAdjust(elements, i, elements.length);
      }
    }

    buildHeap(elements);
    //从数列的尾部开始进行调整
    for (var i = elements.length - 1; i > 0; i--) {
      //堆顶永远是最大元素，故，将堆顶和尾部元素交换，将最大元素保存于尾部，并且不参与后面的调整
      var swap = elements[i];
      elements[i] = elements[0];
      elements[0] = swap;
      //进行调整，将最大）元素调整至堆顶
      headAdjust(elements, 0, i);
    }
  },
  dbLink() {
    // 节点类
    var Node = function (pData) {
      this.next = null; // 后继“指针”
      this.prev = null; // 前驱"指针"
      this.data = pData;
    }
    // 单链表(约定：头节点不放内容，当哨兵位，有效元素从头节点后的第1个元素开始)
    // 印象中链表中每个元素都有头,尾指针指向前,后元素地址.理论上规定单方向后只需一个指针便能完成链 存放前后指针意义??
    var DbLinkList = function () {
      this.head = new Node(null); //头节点 
      // this.size
    }
    // 插入新元素
    DbLinkList.prototype.insert = function (pNodeValue) {
      var newNode = new Node(pNodeValue);
      // 遍历找到尾节点
      var p = this.head;
      while (p.next != null) {
        p = p.next;
      }
      p.next = newNode;
      newNode.prev = p;
    }
    // 获取第n个元素的数据值
    DbLinkList.prototype.getData = function (index) {
      if (index < 1 || index > this.size) {
        return null;
      }
      var p = this.head;
      var i = 1;
      while (p.next != null && i <= index) {
        p = p.next;
        i += 1;
      }
      return p.data;
    }
    // 取尾节点
    DbLinkList.prototype.getTail = function () {
      if (this.head.next == null) {
        return null;
      }
      var p = this.head.next;
      while (p.next != null) {
        p = p.next;
      }
      return p;
    }
    //删除指定位置的元素
    DbLinkList.prototype.removeAt = function (index) {
      if (index < 1 || index > this.size) {
        return null;
      }
      var p = this.head;
      var i = 1;
      //从头开始遍历，找到index位置的前一个元素
      while (p.next != null && i < index) {
        p = p.next;
        i += 1;
      }
      p.next = p.next.next; //修改index位置前一个元素的后继指针
      p.next.prev = p;
      return p.data; //返回删除元素的值    
    }
    // 打印所有元素
    DbLinkList.prototype.print = function () {
     console.log("<br/>");
      if (this.head.next == null) {
        return;
      }
      var p = this.head.next;
      while (p.next != null) {
       console.log(p.data + " ");
        p = p.next;
      }
     console.log(p.data + " "); //最后一个元素，需要单独打印
     console.log("<br/>");
    }
    //从后打印所有元素
    DbLinkList.prototype.printFromBack = function () {
     console.log("该链表共有" + this.size + "个元素，从后向前分别为:<br/>");
      var tail = this.getTail();
      var p = tail;
      if (p == null) {
        return;
      }
      while (p.prev != null) {
       console.log(p.data + " ");
        p = p.prev;
      }
     console.log("<br/>");
    }
    //插入排序
    DbLinkList.prototype.insertSort = function () {
      if (this.head.next == null || this.head.next.next == null) {
        return;
      }
      var p = this.head.next;
      while (true) {
        if (p == null) {
          return;
        }
        var t = p.prev;
        //向前查找p之前的插入点
        while (t.prev != null && t.data > p.data) {
          t = t.prev;
        }
        //如果插入点就是p的前驱节点，不用调整，
        //忽略，直接进入下一轮
        if (t.next == p) {
          p = p.next;
          continue;
        }
        //将p的后续节点先保护起来，以便下一轮循环时确定起始位置
        var x = p.next;
        //将p从链表上摘下
        if (p.next != null) {
          p.next.prev = p.prev;
        }
        p.prev.next = p.next;
        //p插入到t之后
        t.next.prev = p;
        p.next = t.next;
        t.next = p;
        p.prev = t;
        this.print(); //打印输出，调试用  
        //重新将p定位到下一轮循环的"正确"起始节点
        p = x;
      }
    }
  }
}
