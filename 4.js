const dataset = [ ...new Array(100) ].map((v, index) => ({
	key: index,
	value: Math.round(Math.random() * 100)
}));


const add = (heap, elem) => {
	const newHeap = [ ...heap, elem ];
	let i = newHeap.length - 1;
	let parentIndex = (i - 1) / 2;

	while (i > 0 && newHeap[parentIndex] < newHeap[i]) {
		const temp = newHeap[i];
		newHeap[i] = newHeap[parentIndex];
		newHeap[parentIndex] = temp;

		i = parentIndex;
		parentIndex = (i - 1) / 2;
	}

	return newHeap;
};
const getMin = (heap) => {
	let list = [ ...heap ];
	let result = list[0];
	list[0] = list[list.length - 1];
	list = list.slice(0,list.length - 1);

	return [ result, list ];
};
const heapify = (heap, i) => {
	let leftChild;
	let rightChild;
	let largestChild;

	while(true) {
		leftChild = 2 * i + 1;
		rightChild = 2 * i + 2;
		largestChild = i;

		if (leftChild < heap.length && heap[leftChild].value > heap[largestChild].value) {
			largestChild = leftChild;
		}

		if (rightChild < heap.length && heap[rightChild].value > heap[largestChild].value) {
			largestChild = rightChild;
		}

		if (largestChild == i) break;

		let temp = heap[i];
		heap[i] = heap[largestChild];
		heap[largestChild] = temp;
		i = largestChild;
	}
}


const buildHeap = (dataset) => {
	const heap = dataset;
	for (let i = heap.length / 2; i >= 0; i--){
		heapify(heap, i);
	}
	return heap;
};

console.log(JSON.stringify(buildHeap(dataset)));
