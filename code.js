"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { widget } = figma;
const { useSyncedState, useEffect, usePropertyMenu, AutoLayout, Text, Input } = widget;
function FeedbackWidget() {
    let origin = '';
    const [settingsOpen, setSettingsOpen] = useSyncedState('settignsOpen', true);
    const [title, setTitle] = useSyncedState('title', 'Was this page helpful?');
    const [description, setDescription] = useSyncedState('description', 'We use this feedback to improve our guidelines.');
    const [url, setUrl] = useSyncedState('url', '');
    const [feedback, setFeedback] = useSyncedState('feedback', '');
    const [comment, setComment] = useSyncedState('comment', '');
    const [error, setError] = useSyncedState('error', '');
    const urlRegex = new RegExp("^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$");
    useEffect(() => {
        if (figma.editorType === 'figjam') {
            origin = figma.currentPage.parent.name;
        }
        else {
            origin = figma.currentPage.parent.name + ' / ' + figma.currentPage.name;
        }
        figma.ui.onmessage = (response) => __awaiter(this, void 0, void 0, function* () {
            if (response.type === 'success') {
                figma.notify('Feedback sent, thank you!');
                resetStates();
                figma.closePlugin();
            }
            else if (response.type === 'urlError') {
                setError('Something went wrong. There\'s probably problems with CORS. Your hook should allow access from any origin.');
                figma.closePlugin();
            }
            else if (response.type === 'requestError') {
                setError('Something went wrong. Please try again. If this keeps happening there\'s problems with the POST request.');
                figma.closePlugin();
            }
        });
        // Close widget when the page has changed
        figma.on('currentpagechange', () => {
            figma.closePlugin();
        });
    });
    function ActiveButton({ label, onClick }) {
        return (figma.widget.h(AutoLayout, { name: 'ActiveButton', direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 40, width: 'fill-parent', padding: {
                vertical: 8,
                horizontal: 16,
            }, fill: '#dbeafe', stroke: '#93c5fd', cornerRadius: 8, hoverStyle: {
                fill: '#bfdbfe',
            }, onClick: onClick },
            figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1d4ed8', width: 'fill-parent', horizontalAlignText: 'center' }, label)));
    }
    function SecondaryButton({ label, onClick }) {
        return (figma.widget.h(AutoLayout, { name: 'SecondaryButton', direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 40, width: 'fill-parent', padding: {
                vertical: 8,
                horizontal: 16,
            }, fill: '#ffffff', stroke: '#d1d5db', cornerRadius: 8, hoverStyle: {
                fill: '#f3f4f6',
            }, onClick: onClick },
            figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1f2937', width: 'fill-parent', horizontalAlignText: 'center' }, label)));
    }
    function PrimaryButton({ label, onClick }) {
        return (figma.widget.h(AutoLayout, { name: 'PrimaryButton', direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 40, width: 'fill-parent', padding: {
                vertical: 8,
                horizontal: 16,
            }, fill: '#2563eb', cornerRadius: 8, hoverStyle: {
                fill: '#1d4ed8',
            }, onClick: onClick },
            figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#ffffff', width: 'fill-parent', horizontalAlignText: 'center' }, label)));
    }
    function DisabledButton({ label, onClick }) {
        return (figma.widget.h(AutoLayout, { name: 'DisabledButton', direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 40, width: 'fill-parent', padding: {
                vertical: 8,
                horizontal: 16,
            }, fill: '#e5e7eb', cornerRadius: 8, hoverStyle: {
                fill: '#e5e7eb',
            }, onClick: onClick },
            figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#6b7280', width: 'fill-parent', horizontalAlignText: 'center' }, label)));
    }
    function resetStates() {
        setFeedback('');
        setComment('');
        setError('');
    }
    function submitHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                setError('');
                figma.showUI(__html__, { visible: false });
                figma.ui.postMessage({
                    url: url,
                    feedback: feedback,
                    comment: comment,
                    origin: origin,
                    //dateFormat: dateFormat,
                });
            });
        });
    }
    usePropertyMenu([
        !settingsOpen && {
            itemType: 'action',
            tooltip: 'Edit widget',
            propertyName: 'edit',
        },
    ].filter(i => !!i), () => {
        setSettingsOpen(true);
    });
    return (figma.widget.h(AutoLayout, { name: 'FeedbackWidget', direction: 'vertical', height: 'hug-contents', horizontalAlignItems: 'center', width: 400, fill: '#ffffff', padding: 32, effect: {
            type: 'drop-shadow',
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 4 },
            blur: 8,
        }, spacing: 24, cornerRadius: 12 },
        settingsOpen && (figma.widget.h(figma.widget.Fragment, null,
            figma.widget.h(AutoLayout, { name: 'Container', direction: 'vertical', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 'hug-contents', width: 'fill-parent', spacing: 8 },
                figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 32, width: 'fill-parent', fontSize: 25, fill: '#1f2937', horizontalAlignText: 'center' }, "Feedback Widget"),
                figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 20, width: 'fill-parent', fontSize: 14, fill: '#6b7280', horizontalAlignText: 'center' }, "A simple setup is required before use.")),
            figma.widget.h(AutoLayout, { name: 'TextField', direction: 'vertical', spacing: 8, width: 'fill-parent' },
                figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1f2937', width: 'fill-parent' }, "Title"),
                figma.widget.h(Input, { name: 'Input', value: title, placeholder: 'Title', onTextEditEnd: (e) => {
                        setTitle(e.characters);
                    }, fontSize: 15, fill: '#444444', width: 'fill-parent', inputFrameProps: {
                        fill: '#FFFFFF',
                        stroke: '#DDDDDD',
                        cornerRadius: 8,
                        padding: 12,
                    }, inputBehavior: 'multiline' })),
            figma.widget.h(AutoLayout, { name: 'TextField', direction: 'vertical', spacing: 8, width: 'fill-parent' },
                figma.widget.h(AutoLayout, { name: 'Label', direction: 'horizontal', spacing: 2, width: 'fill-parent' },
                    figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1f2937' }, "Description"),
                    figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 20, fontSize: 14, fill: '#6b7280' }, "(optional)")),
                figma.widget.h(Input, { name: 'Input', value: description, placeholder: 'Description', onTextEditEnd: (e) => {
                        setDescription(e.characters);
                    }, fontSize: 15, fill: '#444444', width: 'fill-parent', inputFrameProps: {
                        fill: '#FFFFFF',
                        stroke: '#DDDDDD',
                        cornerRadius: 8,
                        padding: 12,
                    }, inputBehavior: 'multiline' })),
            figma.widget.h(AutoLayout, { name: 'TextField', direction: 'vertical', spacing: 8, width: 'fill-parent' },
                figma.widget.h(AutoLayout, { name: 'Label', direction: 'horizontal', spacing: 2, width: 'fill-parent' },
                    figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1f2937' }, "Webhook URL"),
                    figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 20, fontSize: 14, fill: '#6b7280' }, "(must contain http(s)://)")),
                figma.widget.h(Input, { name: 'Input', value: url, placeholder: 'Where to send the JSON?', onTextEditEnd: (e) => {
                        setUrl(e.characters);
                    }, fontSize: 15, fill: '#444444', width: 'fill-parent', inputFrameProps: {
                        fill: '#FFFFFF',
                        stroke: '#DDDDDD',
                        cornerRadius: 8,
                        padding: 12,
                    }, inputBehavior: 'multiline' })),
            (url !== '' && urlRegex.test(url) === true)
                ? figma.widget.h(PrimaryButton, { label: 'Setup widget', onClick: () => {
                        setSettingsOpen(false);
                        resetStates();
                    } })
                : figma.widget.h(DisabledButton, { label: 'Setup widget' }))),
        !settingsOpen && (figma.widget.h(figma.widget.Fragment, null,
            figma.widget.h(AutoLayout, { name: 'Container', direction: 'vertical', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 'hug-contents', width: 'fill-parent', spacing: 8 },
                figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 32, width: 'fill-parent', fontSize: 25, fill: '#1f2937', horizontalAlignText: 'center' }, title === ''
                    ? 'Was this page helpful?'
                    : title),
                description !== '' && (figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 20, width: 'fill-parent', fontSize: 14, fill: '#6b7280', horizontalAlignText: 'center' }, description))),
            figma.widget.h(AutoLayout, { name: 'Container', direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', height: 'hug-contents', width: 'fill-parent', spacing: 8 },
                feedback === '' && (figma.widget.h(figma.widget.Fragment, null,
                    figma.widget.h(SecondaryButton, { label: 'Yes', onClick: () => setFeedback('positive') }),
                    figma.widget.h(SecondaryButton, { label: 'No', onClick: () => setFeedback('negative') }))),
                feedback === 'positive' && (figma.widget.h(figma.widget.Fragment, null,
                    figma.widget.h(ActiveButton, { label: 'Yes', onClick: () => {
                            resetStates();
                        } }),
                    figma.widget.h(SecondaryButton, { label: 'No', onClick: () => setFeedback('negative') }))),
                feedback === 'negative' && (figma.widget.h(figma.widget.Fragment, null,
                    figma.widget.h(SecondaryButton, { label: 'Yes', onClick: () => setFeedback('positive') }),
                    figma.widget.h(ActiveButton, { label: 'No', onClick: () => {
                            resetStates();
                        } })))),
            feedback !== '' && (figma.widget.h(figma.widget.Fragment, null,
                figma.widget.h(AutoLayout, { name: 'TextField', direction: 'vertical', spacing: 8, width: 'fill-parent' },
                    figma.widget.h(AutoLayout, { name: 'Label', direction: 'horizontal', spacing: 2, width: 'fill-parent' },
                        figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 600, lineHeight: 20, fontSize: 14, fill: '#1f2937' }, "Can tell us more?"),
                        figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 20, fontSize: 14, fill: '#6b7280' }, "(optional)")),
                    figma.widget.h(Input, { name: 'Input', value: comment, placeholder: 'Share your feedback here...', onTextEditEnd: (e) => {
                            setComment(e.characters);
                        }, fontSize: 15, fill: '#444444', width: 'fill-parent', inputFrameProps: {
                            fill: '#FFFFFF',
                            stroke: '#DDDDDD',
                            cornerRadius: 8,
                            padding: 12,
                        }, inputBehavior: 'multiline' })),
                figma.widget.h(AutoLayout, { name: 'Container', direction: 'vertical', spacing: 8, width: 'fill-parent' },
                    figma.widget.h(PrimaryButton, { label: 'Send feedback', onClick: () => submitHandler() }),
                    figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 22, fontSize: 14, fill: '#6b7280', width: 'fill-parent', horizontalAlignText: 'center' }, "This feedback is anonymous.")),
                error !== '' && (figma.widget.h(figma.widget.Fragment, null,
                    figma.widget.h(AutoLayout, { direction: 'horizontal', horizontalAlignItems: 'center', verticalAlignItems: 'center', padding: {
                            vertical: 8,
                            horizontal: 16,
                        }, fill: '#fee2e2', cornerRadius: 8, width: 'fill-parent' },
                        figma.widget.h(Text, { fontFamily: 'Inter', fontWeight: 400, lineHeight: 22, fontSize: 14, fill: '#b91c1c', width: 'fill-parent' }, error))))))))));
}
widget.register(FeedbackWidget);
