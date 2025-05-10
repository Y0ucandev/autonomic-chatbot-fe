
import Style from './DataSecurityPanel.module.scss'
import CaptionedTitle from '../../utils/captionedTitle/CaptionedTitle'
import safeDate from '../../assets/Animation/safeData.gif'
import dataRecording from '../../assets/Animation/dataRecording.gif'
import encryption from '../../assets/Animation/encryption.gif'
import downloadSummary from '../../assets/Animation/downloadSummary.gif'

const DataSecurityPanel = () => {
    return (
        <div id='dataSecurityPanel'>
            <CaptionedTitle title={'Twoje dane są bezpieczne'} />
            <div className={Style.wrapSecurity}>
                <div className={`${Style.items} ${Style.item1}`}>
                    <img src={safeDate} alt="Animacja kłódki na teczce z dokumentami, symbolizująca ochronę danych. " />
                    <p className={`${Style.description} `} >Chatbot przechowuje dane w sposób bezpieczny i anonimowy.</p>
                </div>
                <div className={`${Style.items} ${Style.item2}`}>
                    <img src={dataRecording} alt="Animowana tarcza z kłódką, symbolizująca zabezpieczenie i ochronę przed zagrożeniami." />
                    <p className={`${Style.description} `}> Ty decydujesz, które informacje są zapisywane i jak są wykorzystywane.</p>
                </div>
                <div className={`${Style.items} ${Style.item3}`}>
                    <img src={encryption} alt="Animacja kłódki, do której ładują się dane, symbolizująca bezpieczne przesyłanie i przechowywanie informacji." />
                    <p className={`${Style.description}`}>Twoje dane są szyfrowane i dostępne wyłącznie dla ciebie. </p>
                </div>
                <div className={`${Style.items} ${Style.item4}`}>
                    <img src={downloadSummary} alt="Animacja pobierania danych, symbolizująca proces ściągania twoich statystyk." />
                    <p className={`${Style.description}`}>Możesz pobrać podsumowanie naszych spotkań, by przedstawić je podczas wizyty u specjalisty.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default DataSecurityPanel