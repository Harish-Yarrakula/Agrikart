import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function Avatars({Image,name}) {
  return (
    <Avatar className='w-full h-full'>
      {/* Pass undefined when no image so the fallback is used instead of an empty src */}
      <AvatarImage src={Image || undefined} alt={name || 'User'} className='object-cover w-full h-full' />
      <AvatarFallback className='object-cover w-full h-full p-2'>{(name||'User').slice(0,2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}