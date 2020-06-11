const red = 'red';
const black = 'black';

const dataset = [ ...new Array(100) ].map((v, index) => ({
	key: index,
	value: Math.round(Math.random() * 100)
}));

const addItem = (root, item) => {
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

		return item;
	}
};
const rotate = (tree, type) => {
	const parent = tree.parent;
	const node = { ...tree };
	const left = { ...tree.left };
	const right = { ...tree.right };

	if (!tree) return true;

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
const fixBalancing = (item) => {
	if(!item) return true;
	const father = item.parent;
	const side = father.left && father.left.key === item.key ? 'left' : 'right';
	const uncle = father && father.parent && item.parent.parent[side === 'left' ? 'right' : 'left' ];

	if (father.color === red) {
		if (uncle) {
			if (uncle.color === red) {
				father.color = black;
				uncle.color = black;
				father.parent.color = red;
				fixBalancing(father.parent);
			}
		} else {
			if(side === 'left') {
				rotate(item.parent, 'left');
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
};
const balanceAfterDeleting = (root) => {
	let p = root;
	while (p.color === black) {
		const side = p.parent.left.key === p.key ? 'left' : 'right';
		const brother = p.parent[side === 'left' ? 'right' : 'left' ];

		if (side === 'left') {
			if (brother.color === red){
				brother.color = black;
				p.parent.color = red;
				rotate(p, 'left');
			}
			if (brother.left.color === black && brother.right.color === black) {
				brother.color = red;
			} else {
				if(brother.right.color === black) {
					brother.left.color = black;
					brother.color = red;
					rotate(p, 'left');
				} else {
					brother.color = p.parent.color;
					p.parent.color = black;
					brother.right.color = black;
					rotate(p, 'right');
				}
			}
		} else {
			if (brother.color === red){
				brother.color = black;
				parent.color = red;
				rotate(p, 'right');
			}
			if (brother.left.color === black && brother.right.color === black) {
				brother.color = red;
			} else {
				if(brother.left.color === black) {
					brother.right.color = black;
					brother.color = red;
					rotate(p, 'right');
				} else {
					brother.color = p.parent.color;
					p.parent.color = black;
					brother.left.color = black;
					rotate(p, 'left');
				}
			}
		}
	}
	p.color = black;
}
const removeItem = (root, key) => {
	let p = root;
	let side = p.parent && p.parent.left && p.parent.left.key === key ? 'left' : 'right';
	while(p.key != key) {
		if(p.key < key) {
			p = p.right
		} else {
			p = p.left
		}
	}
	if(!p.left && !p.right){
		if(p.parent) p.parent[side] === undefined;
	} else if((p.left && !p.right) || (!p.left && p.right)) {
		if(p.parent) p.parent[side] === p.left || p.right;
		p.parent[side].parent = p.parent;
	} else {
		let y = p.parent[side === 'left' ? 'right' : 'left'];
		if(y.right){
			y.right.parent = p.parent;
		} else {
			y.right.parent = p.left || p.right;;
		}
		balanceAfterDeleting(root);
	}
};

const insertItem = (root, item) => {
	const inserted = addItem(root, item);
	fixBalancing(inserted);
	root.color = black;
};


const buildTree = (dataset) => {
	let root = {
		color: black
	};
	root = { ...root, ...dataset.shift() };

	let item = dataset.shift();
	while (item){
		insertItem(root, item);
		item = dataset.shift();
	}

	return root;
};

console.log(buildTree(dataset));
