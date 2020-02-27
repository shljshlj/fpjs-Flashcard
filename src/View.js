import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import {
	addNewFlashcardMsg,
	questionInputMsg,
	answerInputMsg,
	showAnswerMsg,
	rankAnswerMsg,
	deleteCardMsg,
	saveCardMsg,
	editCardMsg,
} from './Update';

const {
	div,
	h1,
	button,
	i,
	a,
	textarea,
	pre, } = hh(h);

function createFlashcardButton(dispatch, clickMsg) {
	return button(
		{
			className: 'pa2 br1 mv2 bg-green bn white pointer',
			type: 'button',
			onclick: () => dispatch(clickMsg),
		},
		[
			i({ className: 'ph1 fa fa-plus' }),
			'Add Flashcard',
		]
	);
}

function cardsList(dispatch, cards) {
	return div({ className: 'flex flex-wrap nl2 nr2' },
		R.map(R.partial(cardSingle, [dispatch]), cards)
	);
}

function cardSingle(dispatch, card) {
	const { id, question, answer, editMode, questionMode } = card;
	if (editMode) return cardForm(dispatch, card);

	return div({ className: 'w-third pa2' }, [
		div({ className: 'w-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5' }, [
			questionView(question,
				() => dispatch(editCardMsg(id))),
			answerView(answer, questionMode,
				() => dispatch(showAnswerMsg(id)),
				() => dispatch(editCardMsg(id))),
			questionMode ? '' : rankingButtons(dispatch, id, rankAnswerMsg),
			deleteCard(() => dispatch(deleteCardMsg(id))),
		]),
	]);
}

function deleteCard(onclick) {
	return i({
		className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
		onclick,
	});
}

function questionView(question, onclick) {
	return div([
		div({ className: 'b f6 mv1 underline' }, 'Question'),
		div({
			className: 'pointer hover-bg-black-10 bg-animate pv2 ph1',
			onclick
		}, question),
	]);
}

function answerView(answer, questionMode, onclickView, onclickAnswer) {
	if (questionMode) {
		return div([
			a(
				{
					className: 'f6 underline link pointer',
					onclick: onclickView,
				}, 'Show Answer')
		]);
	}

	return div([
		div({ className: 'b f6 mv1 underline' }, 'Answer'),
		div({
			className: 'pointer hover-bg-black-10  bg-animate pv2 ph1',
			onclick: onclickAnswer
		}, answer),
	]);
}


function rankingButtons(dispatch, cardId, clickMsg) {
	return div({ className: 'absolute bottom-0 left-0 w-100 ph2' }, [
		div({ className: 'mv2 flex justify-between' }, [
			button(
				{
					className: 'f4 ph3 pv2 bg-red bn white br1',
					onclick: () => dispatch(clickMsg(cardId, 0)),
				},
				'Bad',
			),
			button(
				{
					className: 'f4 ph3 pv2 bg-blue bn white br1',
					onclick: () => dispatch(clickMsg(cardId, 1)),
				},
				'Good',
			),
			button(
				{
					className: 'f4 ph3 pv2 bg-dark-green bn white br1',
					onclick: () => dispatch(clickMsg(cardId, 2)),
				},
				'Great',
			),
		]),
	]);
}

function cardForm(dispatch, card) {
	const { id, question, answer } = card;
	return div({ className: 'w-third pa2' }, [
		div({ className: 'w-100 pa2 bg-light-yellow mv2 shadow-1 relative' }, [
			textAreaSet('Question', question,
				e => dispatch(questionInputMsg(id, e.target.value))
			),
			textAreaSet('Answer', answer,
				e => dispatch(answerInputMsg(id, e.target.value))
			),
			button({
				className: 'f4 ph3 pv2 br1 bg-gray bn white mv2',
				onclick: () => dispatch(saveCardMsg(id)),
			}, 'Save'),
			deleteCard(() => dispatch(deleteCardMsg(id))),
		])
	]);
}

function textAreaSet(label, inputValue, oninput) {
	return div([
		div({ className: 'b f6 mv1' }, label),
		textarea({
			className: 'mw-100 bg-washed-yellow outline-0',
			oninput
		}, inputValue),
	]);
}

function view(dispatch, model) {
	const { cards } = model;
	return div({ className: 'mw8 center' }, [
		h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
		createFlashcardButton(dispatch, addNewFlashcardMsg),
		cardsList(dispatch, cards),
		pre(JSON.stringify(model, null, 2)),
	]);
}

export default view;
