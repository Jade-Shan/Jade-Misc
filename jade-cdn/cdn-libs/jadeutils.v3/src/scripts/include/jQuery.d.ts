declare function SampleJquery(selector: string): any;

declare namespace SampleJquery {
    function ajax(url: string, settings?: any): void;
	function each<T>(arr: Array<T>, fun: (i: number, t: T) => void): void;
}

