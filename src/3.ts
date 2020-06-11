interface KeyValue {
	key: number,
	value: number
}

interface BlackRedTree<T> {
	color: string,
	key: number,
	value: T,
	left?: BlackRedTree<T>,
	right?: BlackRedTree<T>,
	parent?: BlackRedTree<T>
}

const red = 'red';
const black = 'black';

const dataset = [ ...new Array<KeyValue>(100) ].map((_v, index) => ({
	key: index,
	value: Math.round(Math.random() * 100)
}));

function addItem<T>(root: BlackRedTree<T>, item: BlackRedTree<T>) {
	item.color = red;
	if (root.key > item.key && root.left) {
		insertItem(root.left, item);
	} else if (root.key < item.key && root.right) {
		insertItem(root.right, item);
	} else {
		const left = root.key > item.key;
		item.parent = root;
		if (left) {
			root.left = item;
		} else {
			root.right = item;
		}
	}
}
function rotate<T>(tree: BlackRedTree<T>, type: "right" | "left") {
	const parent = tree.parent;
	const node = { ...tree } as BlackRedTree<T>;
	const left = { ...tree.left } as BlackRedTree<T>;
	const right = { ...tree.right } as BlackRedTree<T>;

	if (!tree) return;

	if (type === 'right' && left) {
		tree = left;
		node.left = tree.right;
		tree.right = node;
		tree.parent = parent;
	} else if(!!right) {
		tree = right;
		node.right = tree.left;
		tree.left = node;
		tree.parent = parent;
	}

};
function fixBalancing<T>(item: BlackRedTree<T>) {
	if(!item) return;
	const father = item.parent;
	if (father) {
		const side = father.left && father.left.key === item.key ? 'left' : 'right';
		const uncle = father && father.parent && father.parent[side === 'left' ? 'right' : 'left' ];

		if (father.color === red) {
			if (uncle) {
				if (uncle.color === red && father.parent) {
					father.color = black;
					uncle.color = black;
					father.parent.color = red;
					fixBalancing(father.parent);
				}
			} else {
				if(side === 'left') {
					rotate(father, 'left');
					if(father.parent){
						father.parent.color = black; //father
						if(father.parent.parent) father.parent.parent.color = red; //grandfather
						rotate(father.parent, 'right');
					}
				} else {
					rotate(father, 'right');
					if(father.parent){
						father.parent.color = black; //father
						if(father.parent.parent) father.parent.parent.color = red; //grandfather
						rotate(father.parent, 'left');
					}
				}
			}
		}
	}
}
function balanceAfterDeleting<T>(root: BlackRedTree<T>) {
	let p = root;
	while (p.color === black && p.parent && p.parent.left) {
		const side = p.parent.left.key === p.key ? 'left' : 'right';
		const brother = p.parent[side === 'left' ? 'right' : 'left' ];

		if (brother) {
			if (side === 'left') {
				if (brother.color === red){
					brother.color = black;
					p.parent.color = red;
					rotate(p, 'left');
				}
				if (brother.left?.color === black && brother.right?.color === black) {
					brother.color = red;
				} else {
					if (brother.left && brother.right?.color === black) {
						brother.left.color = black;
						brother.color = red;
						rotate(p, 'left');
					} else {
						brother.color = p.parent.color;
						p.parent.color = black;
						brother.right && (brother.right.color = black);
						rotate(p, 'right');
					}
				}
			} else {
				if (brother.color === red){
					brother.color = black;
					p.parent.color = red;
					rotate(p, 'right');
				}
				if (brother.left?.color === black && brother.right?.color === black) {
					brother.color = red;
				} else {
					if (brother.left?.color === black && brother.right) {
						brother.right.color = black;
						brother.color = red;
						rotate(p, 'right');
					} else {
						brother.color = p.parent.color;
						p.parent.color = black;
						brother.left && (brother.left.color = black);
						rotate(p, 'left');
					}
				}
			}
		}
	}
	p.color = black;
}

function removeItem<T>(root: BlackRedTree<T>, key: number) {
	let p: BlackRedTree<T> | undefined = root;
	let side = p.parent && p.parent.left && p.parent.left.key === key ? 'left' : 'right';
	let itemRef = p.parent && p.parent.left && p.parent.left.key === key ? p.parent.left : p.parent?.right;
	while (p?.key != key) {
		if (p?.key) {
			if (p.key < key) {
				p = p?.right
			} else {
				p = p?.left
			}
		}
	}
	if (!p.left && !p.right) {
		if (p.parent) itemRef = undefined;
	} else if ((p.left && !p.right) || (!p.left && p.right)) {
		if (p.parent) itemRef === p.left || p.right;
		itemRef && (itemRef.parent = p.parent);
	} else {
		let y = side === 'left' ? itemRef?.right : itemRef?.left;
		if (y?.right){
			y.right.parent = p.parent;
		} else {
			y?.right && (y.right.parent = p.left || p.right);
		}
		balanceAfterDeleting(root);
	}
}
function insertItem<T>(root: BlackRedTree<T>, item: BlackRedTree<T>) {
	addItem(root, item);
	fixBalancing(root);
	root.color = black;
}


const buildTree = (dataset: KeyValue[]): BlackRedTree<number> => {
	let root = {
		color: black,
		...dataset.shift()
	} as BlackRedTree<number> ;
	root = { ...root, ...dataset.shift() };

	let item = {
		color: red,
		...dataset.shift()
	} as BlackRedTree<number> ;
	while (item) {
		insertItem(root, item);
		let firstElement = dataset.shift();
		if (firstElement) {
			item = {
				color: red,
				...firstElement
			} as BlackRedTree<number> ;
		} else {
			break;
		}
	}

	return root;
}

export function runTask3() {
	console.log('Black red tree\n', buildTree(dataset), '\n');
}
