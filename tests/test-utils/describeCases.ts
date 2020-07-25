/* eslint-disable no-dupe-class-members */
export class Describer<T> {
	private _name: string;
	private _getCaseName: (T, caseNumber: number) => string;
	private _test: (T) => void;
	private _cases: T[];

	constructor(name) {
		this._name = name;
		this._getCaseName = (_, caseNumber) => `Case ${caseNumber}`;
	}

	public it(name: string): Describer<T>;
	public it(getCaseName: (T, caseNumber?: number) => string): Describer<T>;
	public it(arg: string | ((T, caseNumber?: number) => string)): Describer<T> {
		if (typeof arg === 'string') {
			this._getCaseName = () => arg;
		} else {
			this._getCaseName = arg;
		}
		return this;
	}

	public test(test: (testCase: T) => void): Describer<T> {
		this._test = test;
		return this;
	}

	public cases(cases: T[]): void {
		this._cases = cases;
		this.run();
	}

	private run(): void {
		describe(this._name, () => {
			this._cases.forEach((testCase, index) => {
				it(this._getCaseName(testCase, index), () => {
					this._test(testCase);
				});
			});
		});
	}
}

export function describeCases<T>(name: string): Describer<T> {
	return new Describer(name);
}
