export interface ITestSuiteFileMetaData {
	endTime?: number;
	message?: string;
	name?: string;
	startTime?: number;
	status?: string;
	summary?: string;
	assertionResults: IAssertionResult[];
}

export interface IAssertionResult {
	fullName: string;
	status: string;
	title: string;
	ancestorTitles: string[];
	failureMessages: string[];
	location: ITestLocation;
}

export interface ITestLocation {
	column: number;
	line: number;
}