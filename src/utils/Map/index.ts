export class MutiMap<K, V> {
    private innerMap = new Map<K, Set<V>>();

    add(key: K, val: V) {
        let valSet = this.innerMap.get(key);
        valSet || (valSet = new Set<V>(), this.innerMap.set(key, valSet));
        valSet.add(val);
    }

    set(key: K, valArr: Array<V>) {
        this.innerMap.set(key, new Set(valArr));
    }

    get(key: K): Array<V> {
        const valSet = this.innerMap.get(key);
        return valSet ? Array.from(valSet) : [];
    }

    getAll(): Array<V> {
        const allValArr = new Array<V>();
        const vals = this.innerMap.values();
        let iterator: IteratorResult<Set<V>>;

        do {
            iterator = vals.next();
            const valSet = iterator.value;
            valSet.forEach((val:V) => {
                allValArr.push(val);
            });
        } while(!iterator.done)

        return allValArr;
    }

    delete(key: K) {
        this.innerMap.delete(key);
    }

    deleteItem(key: K, val: V) {
        const valSet = this.innerMap.get(key);
        valSet && valSet.delete(val);
    }

    clear() {
        this.innerMap = new Map<K, Set<V>>();
    }

    itemSize(key: K):number {
        const valSet = this.innerMap.get(key);
        return valSet && valSet.size || 0;
    }

    allItemSize(): number {
        let size = 0;
        const vals = this.innerMap.values();
        let iterator: IteratorResult<Set<V>>;

        do {
            iterator = vals.next();
            const valSet: Set<V> | undefined = iterator.value;
            size += valSet && valSet.size;
        } while(!iterator.done)
        
        return size;
    }

    size(): number {
        return this.innerMap.size;
    }
}