import React from 'react';
import {Segment, Form, Button, Table, Icon, Message} from 'semantic-ui-react';
import {useForm, Controller} from 'react-hook-form';
import FileUploader from 'devextreme-react/file-uploader';
import {putSessionDocumentOnStorage, deleteSessionDocument} from '@/services/sessions';
import {collection, onSnapshot} from 'firebase/firestore';
import {db} from '@/firebase';
import {COLLECTIONS} from '@/constants/collections';

const getDocumentViewerUrl = (url, fileName) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  const pdfExtension = ['pdf'];
  
  if (officeExtensions.includes(fileExtension)) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  } else if (pdfExtension.includes(fileExtension)) {
    return url;
  }
  return url;
};

export const SessionDocuments = ({sessionId, updateSession}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [documents, setDocuments] = React.useState([]);
    const [uploaderKey, setUploaderKey] = React.useState(0);
    
    const {handleSubmit, control, reset, watch} = useForm({
        defaultValues: {
            documents: []
        }
    });
    
    const watchedDocuments = watch('documents');

    React.useEffect(() => {
        if (!sessionId) return;

        const unsubscribe = onSnapshot(
            collection(db, COLLECTIONS.sessions, sessionId, 'documents'),
            (snapshot) => {
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setDocuments(docs);
            },
            (error) => {
                console.error('Error fetching documents:', error);
                alert(error.message);
            }
        );

        return () => unsubscribe();
    }, [sessionId]);

    const onSubmit = async ({documents}) => {
        if (!documents?.length) return;
        
        setIsLoading(true);
        try {
            await Promise.all(
                documents.map(document => 
                    putSessionDocumentOnStorage(sessionId, document)
                )
            );
            reset();
            setUploaderKey(prev => prev + 1);
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (document) => {
        try {
            await deleteSessionDocument(sessionId, document);
        } catch (error) {
            alert(error);
        }
    };

    const isOfficeOrPdf = (fileName) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(fileExtension);
    };

    return (
        <Segment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group widths="equal">
                    <Button
                        icon
                        style={{ alignSelf: "start", marginTop: "16px" }}
                        color="green"
                        loading={isLoading}
                        type="submit"
                        disabled={!watchedDocuments?.length || isLoading}
                    >
                        <Icon name="upload" />
                    </Button>
                    <Controller
                        name="documents"
                        control={control}
                        render={({field}) => (
                            <FileUploader
                                key={uploaderKey}
                                multiple
                                rtlEnabled
                                uploadMode="useButtons"
                                allowCanceling
                                onValueChanged={(e) => field.onChange(e.value)}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Form.Group>
            </Form>

            <Table celled striped className='documents-table'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>שם הקובץ</Table.HeaderCell>
                        <Table.HeaderCell>תאריך העלאה</Table.HeaderCell>
                        <Table.HeaderCell>פעולות</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {documents.length > 0 ? (
                        documents.map((doc) => (
                            <Table.Row key={doc.id}>
                                <Table.Cell>
                                    <Icon name='file outline' />
                                    {isOfficeOrPdf(doc.description) ? (
                                        <>
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                {doc.description} <Icon name="download" size="small" />
                                            </a>
                                            {' | '}
                                            <a 
                                                href={getDocumentViewerUrl(doc.url, doc.description)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                צפייה בקובץ <Icon name="eye" size="small" />
                                            </a>
                                        </>
                                    ) : (
                                        <a 
                                            href={doc.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {doc.description}
                                        </a>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {new Date(doc.date).toLocaleDateString('he-IL')}
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Button
                                        icon
                                        negative
                                        size="tiny"
                                        onClick={() => handleDelete(doc)}
                                    >
                                        <Icon name='trash' />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="3">
                                <Message info>
                                    <Message.Header>אין מסמכים</Message.Header>
                                    <p>לא הועלו מסמכים עדיין</p>
                                </Message>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Segment>
    );
};
