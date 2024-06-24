import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import 'react-image-crop/src/ReactCrop.scss'
import setCanvasPreview from "./setCanvasPreview";
import { setUser } from "../../../src/actions/userActions";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 98;

import './filedroparea.scss';

const FileDropArea = ({ updateAvatar, closeModal, file, minWidth = MIN_DIMENSION, minHeight = MIN_DIMENSION, aspect = 1 }) => {
    const dispatch = useDispatch();

    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState();
    const [error, setError] = useState("");

    const userId = useSelector(state => state.user.userId);
    const userData = useSelector(state => state.user.userData);

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
        const type = minWidth === minHeight ? "users" : "user_header"

        try{
            const formData = new FormData();
            formData.append('imageFile', blob, 'image.png');

            const response = await fetch(`http://172.24.80.146:8080/images/${type}/${userId}/change-image`, {
                method: 'POST',
                body: formData,
            });

            if(!response.ok){
                throw new Error("Ошибка при загрузке изображения!!");
            }

            const data = await response.json();

            UpdateInfo(type, data);
            
        } catch (error){
            console.error('Ошибка при отправке изображения', error);
        }
    }

    const UpdateInfo = (infoType = "users", id) =>{
        const newData = {
            ...userData,
            face: {
                ...userData.face,
                coverID: infoType === "users" ? id : userData.face.coverID,
            },
            headerID: infoType === "user_header" ? id : userData.headerID
        };
        dispatch(setUser(newData));
    };

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