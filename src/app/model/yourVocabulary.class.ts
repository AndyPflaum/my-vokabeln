export class YourVocabulary {
    myLearnedWord: string;
    myLanguage: string;

    constructor(obj?: any) {
        this.myLearnedWord = obj ? obj.myEnglishWord : "";
        this.myLanguage = obj ? obj.myEnglishWord : "";

    }
}