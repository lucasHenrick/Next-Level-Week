import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import{FiUpload} from 'react-icons/fi'
import './styless.css';
import { url } from 'inspector';


interface props{
    onFileUploaded : (File: File) => void;
}

const Dropzone:     React.FC<props> = ({onFileUploaded}) => {


    
    const[selectedFileUrl, setSelectFileUrl] = useState('');
  
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);
        setSelectFileUrl(fileUrl);
        onFileUploaded(file);
  }, [onFileUploaded])

        

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
    accept: 'image/*'
})

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()}  accept="image/*"/>
      
     { selectedFileUrl 
        ? <img src={selectedFileUrl} alt="Point Thumb"/>
        :  (<p>
                <FiUpload />
                Imagem do Estabelecimento
        </p>)
        }
    </div>
  )
}

export default Dropzone;