import * as R from 'ramda';

const MSGS = {
    ADD_NEW_FLASHCARD: 'ADD_NEW_FLASHCARD',
    QUESTION_INPUT: 'QUESTION_INPUT',
    ANSWER_INPUT: 'ANSWER_INPUT',
    SHOW_ANSWER: 'SHOW_ANSWER',
    RANK_ANSWER: 'RANK_ANSWER',
    DELETE_CARD: 'DELETE_CARD',
    SAVE_CARD: 'SAVE_CARD',
    EDIT_CARD: 'EDIT_CARD',
}

export const addNewFlashcardMsg = { type: MSGS.ADD_NEW_FLASHCARD };

export function questionInputMsg(id, question) {
    return {
        type: MSGS.QUESTION_INPUT,
        id,
        question,
    }
}

export function answerInputMsg(id, answer) {
    return {
        type: MSGS.ANSWER_INPUT,
        id,
        answer,
    }
}

export function showAnswerMsg(id) {
    return {
        type: MSGS.SHOW_ANSWER,
        id,
    }
}

export function rankAnswerMsg(id, rank) {
    return {
        type: MSGS.RANK_ANSWER,
        id,
        rank,
    }
}

export function deleteCardMsg(id) {
    return {
        type: MSGS.DELETE_CARD,
        id,
    }
}

export function saveCardMsg(id) {
    return {
        type: MSGS.SAVE_CARD,
        id,
    }
}

export function editCardMsg(id) {
    return {
        type: MSGS.EDIT_CARD,
        id,
    }
}

function update(msg, model) {
    switch (msg.type) {
        case MSGS.ADD_NEW_FLASHCARD: {
            const { nextId } = model;
            const card = {
                id: nextId,
                question: '',
                answer: '',
                rank: 0,
                questionMode: true,
                editMode: true,
            };
            const cards = R.prepend(card, model.cards);

            return { ...model, nextId: nextId + 1, cards };
        }
        case MSGS.QUESTION_INPUT: {
            const { id, question } = msg;
            const cards = R.map(card => {
                if (card.id === id) return { ...card, question };
                return card;
            }, model.cards);

            return { ...model, cards };
        }
        case MSGS.ANSWER_INPUT: {
            const { id, answer } = msg;
            const cards = R.map(card => {
                if (card.id === id) return { ...card, answer };
                return card;
            }, model.cards);

            return { ...model, cards };
        }
        case MSGS.SHOW_ANSWER: {
            const { id } = msg;
            const cards = R.map(card => {
                if (card.id === id) return { ...card, questionMode: false };
                return card;
            })(model.cards);

            return { ...model, cards };
        }
        case MSGS.RANK_ANSWER: {
            const { id, rank } = msg;
            const cards = R.map(card => {
                if (card.id === id) return { ...card, rank, questionMode: true };
                return card;
            }, model.cards);
            const cardsSorted = R.sortWith([
                R.ascend(R.prop('rank')),
                R.ascend(R.prop('id'))
            ])(cards);

            return { ...model, cards: cardsSorted };
        }
        case MSGS.DELETE_CARD: {
            const { id } = msg;
            const cards = R.filter(card => card.id !== id, model.cards);
            return { ...model, cards };
        }
        case MSGS.SAVE_CARD: {
            const { id } = msg;
            const cards = R.map(card => {
                if (card.id === id) return { ...card, editMode: false };
                return card;
            }, model.cards);

            return { ...model, cards };
        }
        case MSGS.EDIT_CARD: {
            const { id } = msg;
            const cards = R.map(
                card => {
                    if (card.id === id) return { ...card, editMode: true };
                    return card;
                },
                model.cards
            );

            return { ...model, cards };
        }
        default:
            return model;
    }
}

export default update;
