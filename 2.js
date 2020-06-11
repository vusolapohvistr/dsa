const dataset = [ ...new Array(100) ].map((v, index) => ({
	key: index,
	value: Math.round(Math.random() * 100)
}));

const comparator = (a, b) => a.key - b.key;

const buildTree = (dataset) => {
	if (dataset.length === 0) {
		return undefined;
	} else if (dataset.length === 1) {
		return dataset[0];
	} else {
		const sorted = dataset.sort(comparator); //It's bad idea to sort every time, but it's good enough for my goals
		const root = sorted[Math.floor(sorted.length / 2)];
		root.left = buildTree(sorted.slice(0, Math.floor(sorted.length / 2) ));
		root.right = buildTree(sorted.slice(Math.floor(sorted.length / 2) + 1))

		return root;
	}
};

const NLR = (tree, key) => {
	if(tree.key === key) return tree.value;

	const left = tree.left && NLR(tree.left, key);
	if(left) return left;

	const right = tree.right &&  NLR(tree.right, key);
	if(right) return right;

	return undefined;
};

const LRN = (tree, key) => {
	const left = tree.left && LRN(tree.left, key);
	if(left) return left;

	const right = tree.right &&  LRN(tree.right, key);
	if(right) return right;

	if(tree.key === key) return tree.value;

	return undefined;
};

const LNR = (tree, key) => {
	const left = tree.left && LRN(tree.left, key);
	if(left) return left;

	if(tree.key === key) return tree.value;

	const right = tree.right &&  LRN(tree.right, key);
	if(right) return right;

	return undefined;
}

const tree = buildTree(dataset);

console.log(JSON.stringify(tree));
console.log(NLR(tree, 12));
console.log(LRN(tree, 12));
console.log(LNR(tree, 12));
