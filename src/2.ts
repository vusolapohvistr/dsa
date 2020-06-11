interface KeyValue {
	key: number,
	value: number
}

interface BinaryTree<T> {
	key: number,
	value: T,
	left?: BinaryTree<T>,
	right?: BinaryTree<T>
}

const dataset = [...new Array<KeyValue>(100)].map((_v, index) => ({
	key: index,
	value: ~~(Math.random() * 100)
}));

const comparator = (a: KeyValue, b: KeyValue) => a.key - b.key;

const buildTree = (dataset: KeyValue[]): BinaryTree<number> | null => {
	if (dataset.length === 0) {
		return null;
	} else if (dataset.length === 1) {
		return dataset[0];
	} else {
		const sorted = dataset.sort(comparator); //It's bad idea to sort every time, but it's good enough for my goals
		const root = sorted[Math.floor(sorted.length / 2)] as BinaryTree<number>;
		root.left = buildTree(sorted.slice(0, Math.floor(sorted.length / 2) )) || undefined;
		root.right = buildTree(sorted.slice(Math.floor(sorted.length / 2) + 1)) || undefined;

		return root;
	}
};

function NLR<T>(tree: BinaryTree<T>, key: number): BinaryTree<T> | T | undefined {
	if (tree.key === key) return tree.value;

	const left = tree.left && NLR(tree.left, key);
	if (left) return left;

	const right = tree.right &&  NLR(tree.right, key);
	if (right) return right;

	return undefined;
}

function LRN<T>(tree: BinaryTree<T>, key: number): BinaryTree<T> | T | undefined {
	const left = tree.left && LRN(tree.left, key);
	if (left) return left;

	const right = tree.right &&  LRN(tree.right, key);
	if (right) return right;

	if (tree.key === key) return tree.value;

	return undefined;
}

function LNR<T>(tree: BinaryTree<T>, key: number): BinaryTree<T> | T | undefined {
	const left = tree.left && LRN(tree.left, key);
	if (left) return left;

	if (tree.key === key) return tree.value;

	const right = tree.right &&  LRN(tree.right, key);
	if (right) return right;

	return undefined;
}

export function runTask2() {
	const tree = buildTree(dataset);
	if (tree) {
		console.log('Binary tree\n', tree);
		console.log('NLR result\n', NLR(tree, 12));
		console.log('LRN result\n', LRN(tree, 12));
		console.log('LNR result\n', LNR(tree, 12), '\n');
	}
}

