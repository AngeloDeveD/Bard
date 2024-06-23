import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/src/ReactCrop.scss'
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 98;

import './filedroparea.scss';

const FileDropArea = ({ updateAvatar, closeModal, file, minWidth = MIN_DIMENSION, minHeight = MIN_DIMENSION, aspect = 1 }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState();
    const [error, setError] = useState("");

    const userId = useSelector(state => state.user.userId);

    const onSelectFile = (file) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageELement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageELement.src = imageUrl;

            imageELement.addEventListener("load", (e) => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth < minWidth || naturalHeight < minHeight) {
                    setError(`Изображение должно иметь минимум ${minWidth} x ${minHeight} пикселей`);
                    return setImgSrc("");
                }
            })

            setImgSrc(imageUrl);
        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthPercent = (minWidth / width) * 100;
        const cropHeightPercent = (minHeight / height) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthPercent,
                height: cropHeightPercent
            },
            aspect,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    }

    const uploadImage = async (blob) => {
        try{
            const formData = new FormData();
            formData.append('file', blob, 'image.png');

            const response = await fetch(`http://172.24.80.146:8080/images/${minWidth === minHeight ? "users" : "user_header"}/${userId}/change-image`, {
                method: 'POST',
                body: formData,
            });

            if(!response.ok){
                throw new Error("Ошибка при загрузке изображения!!");
            }
        } catch (error){
            console.error('Ошибка при отправке изображения', error);
        }
    }

    useEffect(() => {
        file && onSelectFile(file);
    }, []);

    return (
        <>
            {error && <p className="error-message">{error}</p>}
            {imgSrc && (
                <div className="file-input__image-container">
                    <ReactCrop
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        circularCrop={minWidth === minHeight}
                        keepSelection
                        aspect={aspect}
                        minWidth={minWidth}
                        minHeight={minHeight}
                        style={{ maxWidth: "80%" }}
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="Upload"
                            className="file-input__image"
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <div style={{display: "flex"}}>
                        <button
                            className="submit-button"
                            onClick={() => {
                                setCanvasPreview(
                                    imgRef.current,
                                    previewCanvasRef.current,
                                    convertToPixelCrop(
                                        crop,
                                        imgRef.current.width,
                                        imgRef.current.height
                                    )
                                );
                                const dataUrl = previewCanvasRef.current.toDataURL('image/png');
                                previewCanvasRef.current.toBlob((blob) => {
                                    uploadImage(blob);
                                }, 'image/png');
                                updateAvatar(dataUrl);
                                closeModal();
                            }}
                        >
                            Применить
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => {
                                closeModal();
                            }}
                        >
                            Отменить
                        </button>
                    </div>
                </div>
            )}
            {crop && (
                <canvas
                    ref={previewCanvasRef}
                    className="preview-canvas"
                />
            )}
        </>
    );
}

export default FileDropArea;