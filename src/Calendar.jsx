import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [timezone, setTimezone] = useState('cairo')
    const [data, setData] = useState([])
    

    useEffect(() => {
        const getData = async() => {
            try {
                const res = await fetch('http://localhost:3000/')
                if(res.ok) {
                    const responseData = await res.json()
                    console.log(responseData)
                    setData(responseData)
                }
            console.log("success")
            } catch (error) {
                console.log(error.message)
            }
        }
        getData()
    }, [])

        const postData = async(newData) => {
            try {
                const res = await fetch('http://localhost:3000/', {
                method: "POST",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(newData)
            })
            console.log("success")
            } catch (error) {
                console.log(error.message)
            }
        }

        const handleChange = (e) => {
            const newData = e.target.checked ? [...data, {
                date: e.target.value,
                name: 'test' + crypto.randomUUID(),
                id: crypto.randomUUID(),
                time: e.target.id
            }] : data.filter(item => item.date !== e.target.value || item.time !== e.target.id)
            setData(newData)
            postData(newData)
        }

    

    console.log("data", data)

    const nextWeek = () => {
        setCurrentDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 7,
        ))
    }

    const prevWeek = () => {
        setCurrentDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 7,
        ))
    }
    const parent = {
        width: "70%",
        height: "90%",
        background: "lightGray",
        padding: "20px",
        boxShadow: "2px 2px 5px rgba(0,0,0,.2)",
        borderRadius: "10px"
    }
  

    function getWeekDates() {
        const cd = moment(currentDate);
        const monday = cd.clone().startOf('isoWeek');
        const friday = monday.clone().add(4, 'days');

        return {
            monday: monday.format('YYYY-MM-DD'),
            tuesday: monday.clone().add(1, 'days').format('YYYY-MM-DD'),
            wednesday: monday.clone().add(2, 'days').format('YYYY-MM-DD'),
            thursday: monday.clone().add(3, 'days').format('YYYY-MM-DD'),
            friday: friday.format('YYYY-MM-DD')
        };
    }

    const weekDates = getWeekDates();



    function convertTimeRange() {
        const startIST = moment.tz('08:00 AM', 'hh:mm A', 'Asia/Kolkata');
        const endIST = moment.tz('11:00 PM', 'hh:mm A', 'Asia/Kolkata');

        const startCairo = startIST.clone().tz('Africa/Cairo');
        const endCairo = endIST.clone().tz('Africa/Cairo');

        const startAzores = startIST.clone().tz('Atlantic/Azores');
        const endAzores = endIST.clone().tz('Atlantic/Azores');

        const timeRangeIST = [];
        const timeRangeCairo = [];
        const timeRangeAzores = [];

        let currentIST = startIST.clone();
        let currentCairo = startCairo.clone();
        let currentAzores = startAzores.clone();

        while (currentIST.isSameOrBefore(endIST)) {
            timeRangeIST.push(currentIST.format('hh:mm A'));
            timeRangeCairo.push(currentCairo.format('hh:mm A'));
            timeRangeAzores.push(currentAzores.format('hh:mm A'));

            currentIST.add(1, 'hour');
            currentCairo.add(1, 'hour');
            currentAzores.add(1, 'hour');
        }

        return {
            ist: timeRangeIST,
            cairo: timeRangeCairo,
            azores: timeRangeAzores
        };
    }

    const timeRanges = convertTimeRange();
    
    const temp = Object.keys(weekDates).map(key => ({
        id: crypto.randomUUID(),
        day: key,
        date: weekDates[key],
        cairo: timeRanges.cairo,
        azores: timeRanges.azores
    }))


    // console.log(temp)
    // console.log(getDayName(currentDate))
    // console.log(moment('2025-02-19').isBefore(currentDate))
    // console.log("dfsdfsdfsdf", moment('2024-02-16').isSameOrAfter(moment().startOf('day')))

    return (
        <div style={parent}>
            <div className="top" style={{ background: "#a7a7a7", padding: "10px", display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ userSelect: "none", color: "teal", cursor: 'pointer', display: "flex", alignItems: "center", gap: "10px" }} onClick={prevWeek}>
                    <span style={{fontSize: "2rem", fontWeight: 600}}>&lsaquo;</span>
                    <span className="link">Previous Week</span>
                </div>
                <span>{currentDate.toLocaleDateString()}</span>
                <div  style={{ userSelect: "none",color: "teal", cursor: 'pointer',display: "flex", alignItems: "center", gap: "10px" }} onClick={nextWeek}>
                    <span   className="link" style={{fontSize: "1rem"}}>Next Week</span>
                    <span style={{fontSize: "2rem", fontWeight: 600}}>&rsaquo;</span>
                </div>
            </div>
            <div className="middle" style={{ marginTop: "10px", display: 'flex', flexDirection: "column", gap: '10px' }}>
                <span>Timezone:</span>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ height: "30px", border: "1px solid #333", borderRadius: "4px" }}>
                    <option value="azores">UTC-1 Atlantic/Azores</option>
                    <option value="cairo">UTC+2 Africa/Cairo</option>
                </select>
            </div>
            
            <div className="bottom" style={{ marginTop: "10px", height: "80%", display: "flex", flexDirection: 'column', justifyContent: "space-evenly" }}>
                
                {temp && temp.map(item => (
                    <div style={{ display: "flex", alignItems: 'center', gap: "40px", borderBottom: "1px solid rgba(0,0,0,.1)" }}>
                        <div style={{ flex: 1, minWidth: "90px", border: "1px solid #868686", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: '10px', justifyContent: "center", padding: " 30px 10px"}}>
                            <div>{item.day}</div>
                            <div>{item.date}</div>
                        </div>

                        <>
                            {moment(item.date).isBefore(moment().startOf('day')) ? <div style={{flex:  5}}>Past</div> : timezone === 'cairo' && <div style={{ flex: 5, display: "flex", gap: "10px", flexWrap: 'wrap' }}>
                                {item.cairo.map(i => <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <input checked={
                                        data.some(d => d.date === item.date && d.time === i)
                                    } type="checkbox" value={item.date} id={i} onChange={handleChange} />
                                    <label>{i}</label>
                                </div>)}
                            </div>}
                            {moment(item.date).isBefore(moment().startOf('day')) ? '' : timezone === 'azores' && <div style={{flex: 5, display: "flex", gap: "10px", flexWrap: 'wrap' }}>
                                {item.azores.map(i => <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <input checked={
                                        data.some(d => d.date === item.date && d.time === i)
                                    } type="checkbox" value={item.date} name="" id={i} onChange={handleChange} />
                                    <label>{i}</label>
                                </div>)}
                            </div>}
                        </>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Calendar