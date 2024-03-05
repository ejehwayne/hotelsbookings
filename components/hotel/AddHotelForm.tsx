'use client'

import { Hotel, Room } from "@prisma/client"
import * as z from 'zod'
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { useEffect, useState } from "react"
import { UploadButton } from "../uploadthing"
import { useToast } from "../ui/use-toast"
import Image from "next/image"
import { Button } from "../ui/button"
import { Eye, Loader2, PencilLine, Plus, RocketIcon, Trash, XCircle } from "lucide-react"
import axios from 'axios'
import useLocation from "@/hooks/useLocation"
import { ICity, IState } from "country-state-city"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddRoomForm from "../room/AddRoomForm"
import RoomCard from "../room/RoomCard"
import { Separator } from "../ui/separator"




interface AddHotelFormProps{
    hotel: HotelWithRooms | null
}

export type HotelWithRooms = Hotel & {
    rooms : Room[]
}

const formSchema = z.object({
title: z.string().min(3, {
    message: 'Title must be at least three characters'
}),
description:  z.string().min(10, {
    message: 'Description must be at least Ten characters'
}), 
image:  z.string().min(1, {
    message: 'Image is Required'
}),
country:  z.string().min(1, {
    message: 'Country is required'
}),
state:z.string().optional(),
city: z.string().optional(),
locationDescription:  z.string().min(10, {
    message: 'Description must be at least three characters'
}),
gym: z.boolean().optional(),
spa: z.boolean().optional(),
bar : z.boolean().optional(),
laundry  :z.boolean().optional(),
restaurant :z.boolean().optional(),
shopping :z.boolean().optional(),
freeParking :z.boolean().optional(),
bikeRental :z.boolean().optional(),
freeWifi :z.boolean().optional(),
movieNights :z.boolean().optional(),
swimmingPool :z.boolean().optional(),
coffeeShop :z.boolean().optional(),
})


const AddHotel = ({hotel}: AddHotelFormProps) => {
  const [imageIsDeleting, setImageIsDeleting] = useState(false)
  const [image, setImage] = useState <string | undefined>(hotel?.image)
  const [states, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isHotelDelete, setIsHotelDelete] = useState(false)
  const [open, setOpen] = useState(false)

   const {toast} = useToast()

      const router = useRouter()
    const {getAllCountries, getCountryStates, getStateCities} = useLocation()
    const countries = getAllCountries()

   const form = useForm <z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
title : '',
description : '',
image : '',
country: '',
state: '', 
city : '', 
locationDescription : '',
gym : false, 
spa: false,
bar : false,
laundry : false, 
restaurant : false,
shopping : false, 
freeParking : false,
bikeRental : false,
freeWifi : false,
movieNights : false, 
swimmingPool : false, 
coffeeShop : false, 
    },
  })  

    useEffect(() => {
      if(typeof image === 'string'){
       form.setValue(  "image", image, {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
       })
      }
    
      return () => {
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image] )
    

  useEffect(() => {
    const selectedCountry = form.watch('country')
    const selectedState = form.watch('state')
    const stateCities = getStateCities(selectedCountry, selectedState)
     if(stateCities) {
      setCities(stateCities)
     }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('country'), form.watch('state')])
  

   function onSubmit(values: z.infer<typeof formSchema>) {
     setIsLoading(true)
     if(hotel){
       axios.patch(`/api/hotel/${hotel.id}`, values).then((res)=> {
         toast({
        variant: "success",
        description: "🎊🎉Hotel Updated Successfully"
       })

         router.push(`/hotel/${res.data.id}`)
       setIsLoading(false)
       }).catch ((err) => {
        console.log(err)
        toast({
          variant: "destructive",
          description: 'Something went Wrong'
        })
         setIsLoading(false)
      })


     } else{
      axios.post('/api/hotel', values).then((res)=> {
       toast({
        variant: "success",
        description: "🎊🎉Hotel Created Successfully"
       })
         router.push(`/hotel/${res.data.id}`)
       setIsLoading(false)
      }).catch ((err) => {
        console.log(err)
        toast({
          variant: "destructive",
          description: 'Something went Wrong'
        })
         setIsLoading(false)
      })
     }

  }

      const handleDeleteHotel = async (hotel: HotelWithRooms) => {
        setIsHotelDelete(true);
        const getImageKey = (src: string) => src.substring(src.lastIndexOf('/') + 1)

        try {
          const imageKey = getImageKey(hotel.image)
          await axios.post('/api/uploadthing/delete', {imageKey})
          await axios.delete(`/api/hotel/${hotel.id}`)

          setIsHotelDelete(false)

           toast({
        variant: "success",
        description: "😒Hotel Deleted Successfully"
       })

         router.push('/hotel/new')
        } catch (error: any) {
            toast({
        variant: "destructive",
        description: `🎊🎉Hotel Deletion Cannot not be Completed!!, ${error.message}`
       })
        }
      }

    const handleImageDelete = (image: string) => {
       setImageIsDeleting(true)
       const imageKey = image.substring(image.lastIndexOf(`/`) + 1)

       axios.post('/api/uploadthing/delete', {imageKey}).then((res) => {
        if(res.data.success){
          setImage('')
          toast({
            variant: 'success',
            description: 'Image Deleted'
          })
        }

       }). catch(() => {
        toast({
          variant: 'destructive',
          description: 'Something went wrong'
        })

       }).finally(() => {
         setImageIsDeleting(false)
       })
    }

    const handleDalogueOpen = () => {
      setOpen (prev => !prev)
    }

    return ( <div className="">
     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold">{hotel? 'Update Your Hotel' : 'Describe Your Hotel '}</h3>
        <div className=" flex flex-col md:flex-row gap-6">
           <div className="flex-1 flex flex-col gap-6 ">
             <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Title *</FormLabel>
              <FormDescription>
                Provide Your Hotel Name
              </FormDescription>
              <FormControl>
                <Input placeholder="Beach Hotel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Description *</FormLabel>
              <FormDescription>
                Provide a Detailed Description of your Hotel
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Beach Hotel is parked with many amenities!!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <div className="">
             <FormLabel>Choose Amenities</FormLabel>
             <FormDescription>Choose Amenities Popular in Your Hotel</FormDescription>
             <div className="grid grid-cols-2 gap-4 mt-2">
               <FormField 
                control={form.control}
                name="gym"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Gym</FormLabel>
              <FormMessage />
            </FormItem>
          )}

          />
           
              <FormField 
                control={form.control}
                name="spa"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Spa</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />
         
           <FormField 
                control={form.control}
                name="bar"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Bar</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />
                
                <FormField 
                control={form.control}
                name="laundry"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Laundry</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />
           
           <FormField 
                control={form.control}
                name="restaurant"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Restaurant</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

                <FormField 
                control={form.control}
                name="shopping"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Shopping</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

           <FormField 
                control={form.control}
                name="freeParking"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Free-Parking</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

           <FormField 
                control={form.control}
                name="bikeRental"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Bike-Rental</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

          <FormField 
                control={form.control}
                name="movieNights"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Movie Nights</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

           <FormField 
                control={form.control}
                name="swimmingPool"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Swimming Pool</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />

             <FormField 
                control={form.control}
                name="coffeeShop"
               render={({ field }) => (
             <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange  } />
              </FormControl>
               <FormLabel>Coffee Shop</FormLabel>
              <FormMessage />
            </FormItem>
          )}
          />
           </div>
          </div>
           <FormField 
             control={form.control}
                name="image"
                render= {({field}) => (
                  <FormItem className="flex flex-col space-y-3">
                     <FormLabel>Upload an image</FormLabel>
                     <FormDescription>Choose an image that will show-case hotel nicely</FormDescription>
                     <FormControl>
                       {image ? <>
                         <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                          <Image src={image} alt='Hotel Image' fill className="object-contain" />
                           <Button onClick= {() => handleImageDelete(image)} type='button' size='icon' variant='ghost' className='absolute right-[-12px] top-0'>
                             {imageIsDeleting ? <Loader2 /> : <XCircle/>}
                           </Button>
                         </div>
                       </> : <>
                         <div className="flex flex-col items-center max-w[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                             <UploadButton
                                 endpoint="imageUploader"
                                 onClientUploadComplete={(res) => {
                                    // Do something with the response
                                    console.log("Files: ", res);
                                  setImage(res[0].url);
                                  toast({
                                    variant: 'success',
                                    description: ' 🎉🎊 Uploaded Successfully'
                                  })

                                 }}
                                 onUploadError={(error: Error) => {
                                    // Do something with the error.
                                     toast({
                                    variant: 'destructive',
                                    description:` Error! ${error.message} `
                                  })
                                  }}
                                />
                         </div>
                        </>}
                     </FormControl>
                  </FormItem>
                )}
           />
           </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                   control={form.control}
                   name='country'
                   render={({field}) => (
                     <FormItem>
                      <FormLabel>Select Country  *</FormLabel>
                      <FormDescription>In Which Country is Your Property Located ? </FormDescription>
                      <Select
                       disabled= {isLoading }
                       onValueChange = {field.onChange}
                       value ={field.value}
                       defaultValue = {field.value}
                       >
                            <SelectTrigger className="bg-background">
                              <SelectValue defaultValue={field.value} placeholder="Select a Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => {
                                return <SelectItem key={country.isoCode} value={country.isoCode} >{country.name}</SelectItem>
                              })}          
                            </SelectContent>
                       </Select>

                     </FormItem>
                   )}                 
                />

                 <FormField 
                   control={form.control}
                   name='state'
                   render={({field}) => (
                     <FormItem>
                      <FormLabel>Select State </FormLabel>
                      <FormDescription>In Which State is Your Property Located ? </FormDescription>
                      <Select
                       disabled= {isLoading || states.length < 1 }
                       onValueChange = {field.onChange}
                       value ={field.value} 
                       defaultValue = {field.value}
                       >
                            <SelectTrigger className="bg-background">
                              <SelectValue defaultValue={field.value} placeholder="Select a State" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => {
                                return <SelectItem key={state.isoCode} value={state.isoCode} >{state.name}</SelectItem>
                              })}          
                            </SelectContent>
                       </Select>

                     </FormItem>
                   )}                 
                />
              </div>
                                   <FormField 
                   control={form.control}
                   name='city'
                   render={({field}) => (
                     <FormItem>
                      <FormLabel>Select City </FormLabel>
                      <FormDescription>In Which City/town is Your Property Located ? </FormDescription>
                      <Select
                       disabled= {isLoading || cities.length < 1 }
                       onValueChange = {field.onChange}
                       value ={field.value} 
                       defaultValue = {field.value}
                       >
                            <SelectTrigger className="bg-background">
                              <SelectValue defaultValue={field.value} placeholder="Select a City" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => {
                                return <SelectItem key={city.name} value={city.name} >{city.name}</SelectItem>
                              })}          
                            </SelectContent>
                       </Select>

                     </FormItem>
                   )}                 
                />
                <FormField
          control={form.control}
          name="locationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Description *</FormLabel>
              <FormDescription>
                Provide a Detailed Location Description of your Hotel
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Located at the very end of the beach road" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
             {hotel && !hotel.rooms.length && 
             
                 <Alert className="bg-indigo-600 text-white">
               <RocketIcon className="h-4 w-4 stroke-white" />
               <AlertTitle>One Last Step!</AlertTitle>
               <AlertDescription>
                 Your Hotel was Created Successfully 😲.
                 <div className="">Please add Some Rooms to Complete Your Setup</div>
               </AlertDescription>
             </Alert>}
           <div className="flex justify-between gap-2 flex-wrap">
            {hotel && <Button onClick={() => handleDeleteHotel(hotel)} variant="ghost" type="button" 
             className="max-w-[150pxx]" disabled ={isHotelDelete || isLoading}
            >
              {isHotelDelete ? <><Loader2 className='mr-2 h-4 w-4'/>Deleting</> :
               <><Trash className='mr-2 h-4 w-4'/>Delete</>
              }
              </Button>}

               {hotel && <Button type="button" onClick={() => router.push(`/hotel-details/${hotel.id}`) } variant='outline'><Eye className='mr-2 h-4 w-4'/>View</Button>}
                           
                {hotel && 
               
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                           <Button type="button" variant='outline' className="max-w-[150px]">
                             <Plus className='mr-2 h-4 w-4'/> Add Room
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[900px] w-[90%]">
                          <DialogHeader className='px-2'>
                            <DialogTitle>Add a Room</DialogTitle>
                            <DialogDescription>
                               Add Details About a Room in Your Hotels
                            </DialogDescription>
                          </DialogHeader>
                            <AddRoomForm hotel={hotel} handleDalogueOpen={handleDalogueOpen}/>
                           </DialogContent>
                         </Dialog>
                } 

            {hotel ? <Button className="max-w-[150px]" disabled={isLoading}>{isLoading ? <><Loader2 className='mr-2 h-4 w-4'/>Updating</> : <><PencilLine className='mr-2 h-4 w-4'/>Updated</>}</Button> : 
            <Button> {isLoading ? <><Loader2 className='mr-2 h-4 w-4'/>Creating</> : <><PencilLine className='mr-2 h-4 w-4'/>Create Hotel</>}
            </Button>}
           </div>
             {hotel && !!hotel.rooms.length && <div>
                <Separator/>
                <h3 className="text-lg font-semibold my-4">Hotel Rooms *</h3>
                 <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                   {hotel.rooms.map(room => {
                     return <RoomCard key={room.id} hotel={hotel} room={room}/>
                   })}
                 </div>
              </div>}
            </div>    
        </div>
          
       </form>
     </Form>
    </div> );
}

export default AddHotel;

