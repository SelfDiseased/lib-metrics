class a {
  constructor() {
    this.a = "a";
  }

  a: string;
}

class b extends a {
  constructor() {
    super();
    this.b = "b";
  }

  b: string;
}

class bChild extends b {}

export class c extends b {
  private privateProp = "prop c";

  constructor(c = "c") {
    super();
  }

  private privateMethod() {
    return;
  }

  method() {
    return;
  }
}
