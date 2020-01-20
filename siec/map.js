class Map {
	constructor(maxX, maxY, neurons, neurons2, sigma0, eta0, alpha, alpha1) {
    this.neurons = []; //mapa neuronow
    this.maxX = maxX; //maksymalny wymiar X plotna
    this.maxY = maxY; //maksymalny wymiar Y plotna
    this.t = 0; //liczba epok
    this.sigma0 = sigma0; //odleglosc sasiedztwa
    this.eta0 = eta0; //wspolczynnik uczenia
    this.alpha = alpha; //stala do uczenia
    this.alpha1 = alpha1; //stala do zmieniania rozmiaru sasiedztwa
    this.change = 100; //suma przesuniec wszystkich neuronow w aktualnej iteracji

    for(let i=0; i<neurons; i++) {
      this.neurons[i] = [];
      for(let j=0; j<neurons2; j++)
        this.neurons[i][j] = new Neuron(maxX, maxY); //tworzy warstwy z okreslona liczba neuronow
    }
  }

  chooseWinner(x, y) {
    let min = 1000; //ustala duże poczatkowe minimum
    let minIndex = [0,0]; //poczatkowy index elementu wygrywajacego
    for(let i=0; i<this.neurons.length; i++)
      for(let j=0; j<this.neurons[0].length; j++) {
        const distance = this.neurons[i][j].calcDistance(x, y); //liczy dystans neuronu do punktu
        if (distance <= min) { //jesli dystans jest mniejszy od aktualnego minimum to robi z niego nowe minimum
          min = distance;
          minIndex = [i,j];
        }
      }
    return minIndex; //zwraca index neuronu, ktory wygral i jest najblizej punktu
  }

  learnIteration(learnArray) {
    this.t++; //zwiększenie liczby epok o 1
    this.change = 0; //zresetowanie zmiany z poprzedniej epoki

    for(let k=0; k<learnArray.length; k++) {
      const winnerIndex = this.chooseWinner(learnArray[k][0], learnArray[k][1]); //wybiera zwycieski neuron dla aktualnego punktu w ciagu uczacym
      for(let i=0; i<this.neurons.length; i++)
        for(let j=0; j<this.neurons[0].length; j++)
          this.change += this.neurons[i][j].calcNewWeights(this.calcDelta(winnerIndex, [i, j], this.calcSigma(), this.neurons.length), this.calcEta(), [learnArray[k][0], learnArray[k][1]]);
    }
  }

  calcSigma() {
    return this.sigma0 * Math.exp(-this.t/this.alpha1); //liczy sigme
  }

  calcEta() {
    return this.eta0 * Math.exp(-this.t/this.alpha); //liczy wspolczynnik uczenia
  }

  calcDelta(winnerIndex, index, sigma, arrayLength) { //liczy delte
    let distance = 0;
    if (this.neurons[0].length > 1) {
      distance = Math.abs(winnerIndex[0] - index[0]) + Math.abs(winnerIndex[1] - index[1]);
    } else {
      const higherIndex = winnerIndex[0] > index[0] ? winnerIndex[0] : index[0]; //wybiera neuron o wiekszym indeksie
      const lowerIndex = winnerIndex[0] < index[0] ? winnerIndex[0] : index[0]; //wybiera neuron o mniejszym indeksie
      //liczy odleglosc sasiedzka pomiedzy dwoma tymi neuronami
      distance = (higherIndex - lowerIndex) > (arrayLength - higherIndex + lowerIndex) ? arrayLength - higherIndex + lowerIndex : higherIndex - lowerIndex;
    }

    return Math.exp( -( (distance * distance) / (2 * sigma * sigma) ) ); //liczy delte dla neuronu
  }
}
