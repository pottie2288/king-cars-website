/**
 * Verified 5-star Google reviews for King Cars Bellville.
 *
 * Transcribed from the live Google Business Profile listing. These are shown in
 * the homepage testimonial carousel AND emitted as schema.org `Review` objects
 * in the site's structured data, so both stay in sync from this one file.
 *
 * Only add reviews that genuinely exist on the Google listing — the structured
 * data asserts them as fact to search engines and AI assistants.
 *
 * `datePublished` is approximate, derived from the relative age Google displayed
 * when the review was transcribed. Keep it in step with `timeAgo`.
 */
export interface GoogleReview {
  id: number
  name: string
  avatar?: string
  timeAgo: string
  datePublished: string
  text: string
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 1,
    name: 'Marius Crous',
    timeAgo: '2 weeks ago',
    datePublished: '2026-07-30',
    text: 'Clinton Groenewald was my Sales Executive and I have received 5 star service from him. He has listened to my needs, took me through the entire buying experience, we went for a test drive and sorted out all the paper work. Van Zyl and all other I have dealt with all provided me with the KING CAR EXPERIENCE!! I am glad to be a member of the King Cars family!!!',
  },
  {
    id: 3,
    name: 'Mr Moses',
    timeAgo: '2 months ago',
    datePublished: '2026-06-13',
    text: 'I came to King Cars after canceling a very bad deal with a much bigger corporate dealer. I was assisted by Mr Elliot Mfakadolo who from the beginning was very chilled but professional, and then the F&I Adiela Manual made the rest of the process very easy. She listened to our concerns and made us a very good deal. So far I have had a very good experience with King Cars Bellville.',
  },
  {
    id: 4,
    name: 'Emilio Castano',
    timeAgo: '7 months ago',
    datePublished: '2026-01-13',
    text: 'I had the best experience at King Cars Bellville. Everyone was super helpful and made the buying process extremely easy and efficient. They helped me every step of the way. Would highly recommend going to them before purchasing a car. They got a new loyal customer.',
  },
  {
    id: 5,
    name: 'Nashlean-lee Links',
    timeAgo: '7 months ago',
    datePublished: '2026-01-13',
    text: 'Had the absolute best service and experience with this company. From the car salesman (William) to the finance lady (Adiela). All so helpful, patient and kind. Highly recommend!!',
  },
  {
    id: 6,
    name: 'Gwynneth Swart',
    timeAgo: '8 months ago',
    datePublished: '2025-12-13',
    text: 'Choosing a car is such an important and personal experience. I have received the best service and after care service from Dawid Kotze. He has taken the experience to a 5 star level. I would definitely recommend buying your car through this company.',
  },
  {
    id: 7,
    name: 'Sia Dube',
    timeAgo: '5 months ago',
    datePublished: '2026-03-13',
    text: 'Got swift professional assistance from Dawid, quick response and delivery! Even scored a free driving refresher lesson from Dawid! Thank you!',
  },
  {
    id: 8,
    name: 'Fatima Isaacs',
    timeAgo: '8 months ago',
    datePublished: '2025-12-13',
    text: 'Service was great and staff is very helpful. Shout out to Izzy and his wonderful wife :)',
  },
  {
    id: 9,
    name: 'Lyle Claassen',
    timeAgo: 'A year ago',
    datePublished: '2025-08-13',
    text: "Well to start with the guy that helped me, Dawid was excellent from the start. He was helpful and patient until the deal was through, then also sorted out my vehicle's interior afterwards. Thank you for that.",
  },
]

/** Every review in GOOGLE_REVIEWS is a verified 5-star review. */
export const REVIEW_RATING = 5
