import React from 'react'
const locations = [
  "12C , Joypur , Jhargram , 721515",
  "24C , Raghunathpur , Jhargram , 721507",
  "27C , Assam , 721500"
]

const LocationSearchPanel = (props) => {
  console.log(props);
  return (
    <div>LocationSearchPanel
      {/* This is just a sample data */}

      {
        locations.map(function (elem , idx) {
          return <div key={idx} onClick={
            () => {
              props.setVehiclePanel(true);
              props.setPanelOpen(false)
            }
          }
            className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start' >
            <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4>{elem}</h4>
          </div>
        })
      }

    </div>
  )
}

export default LocationSearchPanel