class Roller {
  
    /**
     * @param {String} a
     * @param {String} b
     * @return {String} a
     */
    _equalate(a, b) {
        a = a.split('');
        b = b.split('');
        if (a.length < b.length) {
            for (let i = a.length; i < b.length; i++) {
                a[i] = ' ';
            }
        }
        return a.join('');
    }
  
    /**
     * @param {Number}
     * @param {Number}
     * @return {Number}
     */
    _random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    /**
     * @param {Number}
     * @param {Number}
     * @return {Number}
     */
    _randomChar() {
        return String.fromCharCode(this._random(65, 122));
    }
    
    /**
     * @param {*} from
     * @param {*} to
     * @param {Function} fn
     */
    rollAsync(from, to, fn, delay = 1) {
        const roll = this.roll(from, to);
        const interval = setInterval(() => {
            const value = roll.next().value;
            if (value) {
                fn.call(this, value);
            } else {
                clearInterval(interval);
            }
        }, delay);
    }

    /**
     * @param {*} from
     * @param {*} to
     */
    roll(from, to) {
        from = this._equalate(from, to);
        to = this._equalate(to, from);
        
        if (from.length === 1) {
            return this.rollChars(from, to);
        } else {
            return this.rollWords(from, to);
        }
    }

    /**
     * @param {*} from
     * @param {*} to
     */
    rollWords(from, to) {
        const self = this;
        return function* () {
            const vars = [];
            let length = from.length;
            let count = 0;
          
            for (let i = 0; i < length; i++) {
                const gen = self.rollChars(from[i], to[i]);
                const sub = [];
                let value;
                let localCount = 0;
                
                while (value = gen.next().value) {
                    if (/[1-9a-zA-Z !?,.:]/.test(value)) {
                        sub.push(value);
                    } else {
                        sub.push(self._randomChar());
                    }
                    localCount++;
                }
              
                count = localCount > count ? localCount : count;
                vars.push(sub);
            }

            for (let i = 0; i < length; i++) {
                if (vars[i].length < count) {
                     for (let j = vars[i].length; j < count; j++) {
                          vars[i][j] = vars[i][j-1];
                     }
                }
            }          
            
            for (let i = 0; i < count; i++) {
                let word = '';
              
                for (let j = 0; j < length; j++) {
                    word += vars[j][i];
                }
                
                yield word;
            }
        }();
    }

    /**
     * @param {*} from
     * @param {*} to
     */
    rollChars(from, to) {
        from = ''+ from;
        to = ''+ to;

        let fromCode = from.charCodeAt()
        let toCode = to.charCodeAt();
      
        return function* () {
            if (fromCode <= toCode) {
                for (let i = fromCode; i <= toCode; i++) {
                    yield String.fromCharCode(i);
                }
            } else {
                for (let i = fromCode; i >= toCode; i--) {
                    yield String.fromCharCode(i);
                }
            }
        }();
    }
}

const roller = new Roller();
const elem = document.getElementById('output');
roller.rollAsync(
    '',
    'Hello, World!',
    value => elem.innerHTML = value,
    50
);