// Type declarations for Jest
declare const jest: any;
declare namespace jest {
  function fn(): any;
  function spyOn(object: any, methodName: string): any;
}

// For global type extensions
declare namespace NodeJS {
  interface Global {
    jest: any;
  }
}
