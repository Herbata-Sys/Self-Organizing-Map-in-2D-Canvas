class Neuron {
	constructor(maxX, maxY) { //losuje wagi dla neuronu
    this.weights = [];
		this.weights[0] = Math.floor(Math.random() * (maxX + 1))/10;
    this.weights[1] = Math.floor(Math.random() * (maxY + 1))/10;
  }

  calcDistance(x, y) { //liczy dystans od neuronu do punktu x, y
    return (x - this.weights[0]) * (x - this.weights[0]) + (y - this.weights[1]) * (y - this.weights[1]);
  }

  calcNewWeights(delta, eta, x) { //wylicza nowe wagi dla neuronu i zwraca calkowite przesuniecie
    const changeX = delta * eta * (x[0] - this.weights[0]);
    const changeY = delta * eta * (x[1] - this.weights[1]);
    this.weights[0] = this.weights[0] + changeX;
    this.weights[1] = this.weights[1] + changeY;
    return Math.abs(changeX + changeY);
  }
}
