import util from 'util';
import crypto from 'crypto';

interface HuffmanRoot {
    sum: number,
    value: HuffmanTree | HuffmanLeaf
}

interface HuffmanLeaf {
    symbol: string
}

interface HuffmanTree {
    left: HuffmanLeaf | HuffmanTree
    right: HuffmanLeaf | HuffmanTree
}

interface SymbolFrequency {
    [key: string]: number
}

function getSymbolFrequency(arg: string): SymbolFrequency {
    return arg.split('').reduce((acc: SymbolFrequency, val) => {
        if (acc[val]) {
            acc[val] += 1;
        } else {
            acc[val] = 1;
        }
        return acc;
    }, {})
}

function getHuffmanTree(str: string) {
    const strFrequency = getSymbolFrequency(str);
    let roots: HuffmanRoot[] = Object.keys(strFrequency).map(key => ({
        sum: strFrequency[key],
        value: {
            symbol: key,
        },
    }));
    roots.sort((a, b) => b.sum - a.sum); // 3, 4, 1 -> 4, 3, 1 : desc order
    while (roots.length != 1) {
        const left = roots.pop();
        const right = roots.pop();
        if (left && right) {
            let newFather: HuffmanRoot = {
                sum: left.sum + right.sum,
                value: {
                    left: left.value,
                    right: right.value
                }
            }
            roots.unshift(newFather);
            roots.sort((a, b) => b.sum - a.sum); // 3, 4, 1 -> 4, 3, 1 : desc order
        } else {
            break;
        }
    }
    return roots;
}

export function runTask1() {
    let str = '122333';
    let longStr = crypto.randomBytes(100).toString('hex');
    console.log(util.inspect(getHuffmanTree(longStr), false, null, true /* enable colors */));
}
