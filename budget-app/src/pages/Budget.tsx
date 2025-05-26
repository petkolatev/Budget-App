import { useFilePicker } from 'use-file-picker';
import styles from './Budget.module.css'



export function Budget() {
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        readAs: "Text",
        accept: [".txt"]
    });
    console.log(filesContent[0].content);


    return (
        <div>
            <div className={styles.headline}>
                <h2> Движения по сметка </h2>
                Движения по сметка от датата на регистрацията в е-банката.<br />
                Наредените преводи се печатат от Преводи/Наредени документи.<br />
            </div>
            <div className={styles.divider}></div>
            <div className={styles.dataPicket}>
                <button > Покажи </button>
                <button onClick={() => openFileSelector()}> Избери Файл </button>
            </div>
        </div>
    )
}

export default Budget