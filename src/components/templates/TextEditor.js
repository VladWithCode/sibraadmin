import React, { useEffect, useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { paymentTemplateSet } from '../../actions/payments';
import { templateSet } from '../../actions/templates';

export const TextEditor = ({ template, payment }) => {

    const { content, _id: templateId, state: templateState } = template;

    const dispatch = useDispatch();

    const { templates: { currentTemplates } } = useSelector(state => state);

    const [state, setstate] = useState(templateState);

    // console.log('este es el templateState: ', convertFromRaw(JSON.parse(templateState.toString())));

    useEffect(() => {

        !payment && (
            setstate((s) => {

                const currentTemplate = currentTemplates.find(ct => ct._id === templateId);

                if (currentTemplate) {
                    // return currentTemplate.content
                    return currentTemplate.state
                }

                return s

            })
        )

    }, [currentTemplates, templateId, payment])

    const onEditorStateChange = (editorState) => {
        setstate({ editorState })

        !payment ? (
            dispatch(templateSet({
                _id: templateId,
                // content: draftToHtml(convertToRaw(editorState._immutable.currentContent))
                state: { editorState }
            }))
        )
            :
            (
                dispatch(paymentTemplateSet({
                    _id: templateId,
                    // content: draftToHtml(convertToRaw(editorState._immutable.currentContent))
                    state: { editorState }
                }))
            )

    }

    const { editorState } = state;

    // console.log(draftToHtml(convertToRaw(content.editorState.getCurrentContent())));

    return (

        <>

            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
            />

        </>
    )
}
