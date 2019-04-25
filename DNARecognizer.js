const sequenceQty = 4;
const approvalQty = 2;
class DNARecognizer {
    constructor (dnaArray) {
        if (!this.validateInput(dnaArray)){
            throw "Debe ingresar un dna válido";
        }
        this.dnaArray = dnaArray;
        this.allowedChars = ["T", "G", "C", "A"];
    };

    validateInput(dnaArray){
        return (Array.isArray(dnaArray) && dnaArray.length && dnaArray[0].length == dnaArray.length);
    }
    setDna(dnaArray) {
        //Setter del DNA Array
        this.dnaArray = dnaArray;
    }
    getDiagonalBlocks(array, backwards) {
        /*Esta función obtiene los bloques diagonales de la matriz, y se recorre en backwards si se le envía true como parámetro*/
        let length = this.dnaArray.length;
        let temp;
        let returnArray = [];
        for (let k = 0; k <= 2 * (length - 1); ++k) {
            temp = [];
            for (let y = length - 1; y >= 0; --y) {
                let x = k - (backwards ? length - y : y);
                if (x >= 0 && x < length) {
                    temp.push(this.dnaArray[y][x]);
                }
            }
            /*Si el bloque que obtuve tiene más de 4 coincidencias (Definido y modificable por constante), lo guardo*/
            if (temp.length >= sequenceQty) {
                returnArray.push(temp.join(''));
            }
        }
        return returnArray;
    }

    traspose(arr) {
        //Transponer la "matriz" para lograr verticalidad.
        return arr[0].split("").map((col, i) => arr.map(row => row[i])).map(row => row.join(""));
    }

    getRepeatedQty(str) {
        //Esta función devuelve la cantidad exacta de bloques repetidos que encuentra con los caracteres designados en "allowedChars"
        //return /([TGCA])\1{3,4}/.test(str); Podría hacer esto y sería más simple en código, pero en los casos en los que lleguen bloques de 8 o cualquier múltiplo de 4, lo tomaría como una sola coincidencia, dando falsos positivos.
        let lastChar ="";
        let matches = 0;
        let globalMatches = 0;
        str.split("").forEach((char) => {
            if (char !== lastChar) {
                matches = 0;
            }
            if (this.allowedChars.indexOf(char) !== -1) {
                lastChar = char;
                matches++;
                //Si la cantidad de matches es múltiplo de la cantidad necesaria para la secuencia, sumo uno a los matches globales.
                if (matches % sequenceQty == 0) globalMatches++;
            }
        });
        return globalMatches;
    }

    isMutant() {
        //Inicializo la variable que me indica cuántas secuencias repetidas de la misma letra obtengo.
        let repeatedQty = 0;

        /*A partir de ahora, voy a obtener la cantidad de repeticiones en los 4 vectores (Horizontal, vertical, y ambas diagonales).
        * En caso de encontrar una coincidencia mayor a 2, salgo inmediatamente para no consumir proceso.
        * Se elegió este orden (horizontal, vertical, y diagonales), ya que son los recorridos que menos complejidad computacional tienen O(n) y potencialmente resuelven el problema
        * acudiendo a las diagonales como último recurso.
        */

        //Obtengo la cantidad de repeticiones horizontales
        this.dnaArray.forEach((str) => {
            repeatedQty += this.getRepeatedQty(str);
        });
        if (repeatedQty >= approvalQty) return true;

        //Obtengo la cantidad de repeticiones verticales
        this.traspose(this.dnaArray).forEach((str) => {
            repeatedQty += this.getRepeatedQty(str);
        });
        if (repeatedQty >= approvalQty) return true;

        //Obtengo la cantidad de repeticiones diagonal principal
        this.getDiagonalBlocks(this.dnaArray).forEach((str) => {
            repeatedQty += this.getRepeatedQty(str);
        });
        if (repeatedQty >= approvalQty) return true;

        //Cantidad de repeticiones diagonal invertida
        this.getDiagonalBlocks(this.dnaArray, true).forEach((str) => {
            repeatedQty += this.getRepeatedQty(str);
        });
        return repeatedQty > approvalQty;
    }
}

module.exports = DNARecognizer;
