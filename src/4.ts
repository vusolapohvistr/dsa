interface KeyValue {
	key: number,
	value: number
}

const dataset = [ ...new Array<KeyValue>(100) ].map((_v, index) => ({
	key: index,
	value: Math.round(Math.random() * 100)
}));


const add = (heap: KeyValue[], elem: number) => {
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

const getMin = (heap: KeyValue[]) => {
	let list = [ ...heap ];
	let result = list[0];
	list[0] = list[list.length - 1];
	list = list.slice(0,list.length - 1);

	return [ result, list ];
};
const heapify = (heap: KeyValue[], i: number) => {
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


function buildHeap(dataset: KeyValue[]) {
	const heap = dataset;
	for (let i = heap.length / 2; i >= 0; i--){
		heapify(heap, i);
	}
	return heap;
}

export function runTask4() {
	console.log('Heap \n', buildHeap(dataset), '\n');
}
