import { evaluator } from 'eseval'

export default class MultichartEval {
    static makeExtractor(fcnString) {
        return new evaluator().setProgram(fcnString).start();
    }
}
