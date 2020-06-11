import util from "util";

class BinomialHeap {
    private nodes: BinomialHeapNode | null = null;
    private size: number = 0;

    constructor() {
    }

    isEmpty(): boolean {
        return this.nodes === null;
    }

    getSize(): number {
        return this.size;
    }

    clear() {
        this.nodes = null;
        this.size = 0;
    }

    insert(value: number) {
        if (value > 0) {
            const temp = new BinomialHeapNode(value);
            if (this.nodes == null) {
                this.nodes = temp;
                this.size = 1;
            } else {
                this.unionNodes(temp);
                this.size++;
            }
        } else {
            throw new TypeError('Value must be positive number!');
        }
    }

    private merge(binHeap: BinomialHeapNode) {
        let temp1: BinomialHeapNode | null = this.nodes,
            temp2: BinomialHeapNode | null = binHeap;

        while ((temp1 != null) && (temp2 != null)) {
            if (temp1.degree == temp2.degree) {
                let tmp: BinomialHeapNode = temp2;
                temp2 = temp2.sibling;
                tmp.sibling = temp1.sibling;
                temp1.sibling = tmp;
                temp1 = tmp.sibling;
            } else {
                if (temp1.degree < temp2.degree) {
                    if ((temp1.sibling == null) || (temp1.sibling.degree > temp2.degree)) {
                        let tmp: BinomialHeapNode = temp2;
                        temp2 = temp2.sibling;
                        tmp.sibling = temp1.sibling;
                        temp1.sibling = tmp;
                        temp1 = tmp.sibling;
                    } else {
                        temp1 = temp1.sibling;
                    }
                } else {
                    let tmp: BinomialHeapNode = temp1;
                    temp1 = temp2;
                    temp2 = temp2.sibling;
                    temp1.sibling = tmp;
                    if (tmp == this.nodes) {
                        this.nodes = temp1;
                    }
                }
            }
        }
        if (temp1 == null && this.nodes) {
            temp1 = this.nodes;
            while (temp1.sibling != null) {
                temp1 = temp1.sibling;
            }
            temp1.sibling = temp2;
        }
    }

    private unionNodes(binHeap: BinomialHeapNode) {
        this.merge(binHeap);

        let prevTemp: BinomialHeapNode | null = null,
            temp: BinomialHeapNode | null = this.nodes,
            nextTemp: BinomialHeapNode | null = this.nodes && this.nodes.sibling || null;

        if (temp) {
            while (nextTemp != null) {
                if ((temp.degree != nextTemp.degree) || ((nextTemp.sibling != null) && (nextTemp.sibling.degree == temp.degree))) {
                    prevTemp = temp;
                    temp = nextTemp;
                } else {
                    if (temp.key <= nextTemp.key) {
                        temp.sibling = nextTemp.sibling;
                        nextTemp.parent = temp;
                        nextTemp.sibling = temp.child;
                        temp.child = nextTemp;
                        temp.degree++;
                    } else {
                        if (prevTemp == null) {
                            this.nodes = nextTemp;
                        } else {
                            prevTemp.sibling = nextTemp;
                        }
                        temp.parent = nextTemp;
                        temp.sibling = nextTemp.child;
                        nextTemp.child = temp;
                        nextTemp.degree++;
                        temp = nextTemp;
                    }
                }
                nextTemp = temp.sibling;
            }
        }
    }

    public delete(value: number) {
        if ((this.nodes != null) && (this.nodes.findANodeWithKey(value) != null)) {
            this.decreaseKeyValue(value, this.findMinimum() - 1);
            this.extractMin();
        }
    }

    public findMinimum(): number {
        return this.nodes?.findMinNode().key || 0;
    }

    public decreaseKeyValue(old_value: number, new_value: number) {
        if (this.nodes) {
            let temp: BinomialHeapNode | null = this.nodes.findANodeWithKey(old_value);
            if (temp == null)
                return;
            temp.key = new_value;
            let tempParent: BinomialHeapNode | null = temp.parent;

            while ((tempParent != null) && (temp.key < tempParent.key)) {
                let z = temp.key;
                temp.key = tempParent.key;
                tempParent.key = z;

                temp = tempParent;
                tempParent = tempParent.parent;
            }
        }
    }

    public extractMin(): number {
        if (this.nodes == null)
            return -1;

        let temp: BinomialHeapNode | null = this.nodes,
            prevTemp = null;
        let minNode = this.nodes.findMinNode();

        while (temp && temp.key != minNode.key) {
            prevTemp = temp;
            temp = temp.sibling;
        }

        if (temp) {
            if (prevTemp == null) {
                this.nodes = temp.sibling;
            } else {
                prevTemp.sibling = temp.sibling;
            }

            temp = temp.child;
        }

        let fakeNode = temp;

        while (temp != null) {
            temp.parent = null;
            temp = temp.sibling;
        }

        if ((this.nodes == null) && (fakeNode == null)) {
            this.size = 0;
        } else {
            if ((this.nodes == null) && (fakeNode != null)) {
                this.nodes = fakeNode.reverse(null);
                this.size = this.nodes.getSize();
            } else {
                if ((this.nodes != null) && (fakeNode == null)) {
                    this.size = this.nodes.getSize();
                } else {
                    fakeNode && this.unionNodes(fakeNode.reverse(null));
                    this.nodes && (this.size = this.nodes.getSize());
                }
            }
        }

        return minNode.key;
    }
}

class BinomialHeapNode {
    public degree = 0;
    public parent: BinomialHeapNode | null = null;
    public sibling: BinomialHeapNode | null = null;
    public child: BinomialHeapNode | null = null;

    constructor(public key: number) {
    }

    reverse(sibl: BinomialHeapNode | null) {
        let ret: BinomialHeapNode;
        if (sibl != null) {
            ret = sibl.reverse(this);
        } else {
            ret = this;
        }
        this.sibling = sibl;
        return ret;
    }

    public getSize(): number {
        return (1 + ((this.child == null) ? 0 : this.child.getSize()) + ((this.sibling == null) ? 0 : this.sibling.getSize()));
    }

    public findANodeWithKey(value: number): BinomialHeapNode | null {
        let temp: BinomialHeapNode | null = this,
            node = null;

        while (temp != null) {
            if (temp.key == value) {
                node = temp;
                break;
            }
            if (temp.child == null)
                temp = temp.sibling;
            else {
                node = temp.child.findANodeWithKey(value);
                if (node == null)
                    temp = temp.sibling;
                else
                    break;
            }
        }
        return node;
    }

    public findMinNode(): BinomialHeapNode
    {
        let x: BinomialHeapNode | null = this,
            y: BinomialHeapNode | null = this;
        let min = x.key;

        while (x != null) {
            if (x.key < min) {
                y = x;
                min = x.key;
            }
            x = x.sibling;
        }
        return y;
    }
}

export function runTask5() {
    let binomialHeap = new BinomialHeap();
    (new Array(100)).fill(0).forEach(value => {
        binomialHeap.insert(~~(Math.abs(value * Math.random())) + 1);
    });
    console.log(util.inspect((binomialHeap), false, null, true));
}
