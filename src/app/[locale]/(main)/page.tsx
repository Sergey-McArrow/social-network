import { auth } from '@/auth'
import { getTranslations } from 'next-intl/server'

const HomePage = async () => {
  const session = await auth()
  const t = await getTranslations()

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        {session?.user && (
          <>
            <p>
              {t('auth.loggedInAs')} {session.user.email}
            </p>
          </>
        )}
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
          necessitatibus ex iste ullam esse ipsa nemo voluptates magni delectus
          porro officia, voluptatum sed exercitationem nesciunt obcaecati
          ratione a. Optio officiis blanditiis nesciunt voluptatibus laborum
          labore mollitia incidunt doloremque nihil suscipit deleniti, modi quam
          expedita nulla doloribus quae amet ab repellendus nam obcaecati
          veritatis! Inventore distinctio obcaecati esse ipsum quis dolores fuga
          ex beatae itaque voluptatem, aliquam eos dolorem quia expedita impedit
          repellat? Ratione impedit delectus deserunt culpa alias perspiciatis
          nisi modi aperiam vero. Eaque sapiente aperiam, blanditiis distinctio
          nam voluptates pariatur velit, ullam incidunt ad vel enim quibusdam
          facere, quae recusandae perspiciatis. Veritatis error eveniet iure
          reprehenderit natus magni dolorem vero, praesentium laboriosam soluta.
          Aperiam, officiis nihil ad qui repudiandae nisi quaerat dolore.
          Asperiores labore corrupti accusantium possimus ducimus ea blanditiis
          amet sint placeat totam laborum voluptas vitae quisquam facere
          incidunt aperiam nesciunt, vero fugit modi quas et necessitatibus?
          Maiores doloribus hic dolores iusto! Libero velit necessitatibus nobis
          porro vero saepe quae officiis laborum omnis culpa ipsum architecto
          eaque, excepturi magnam unde molestiae esse facere odit, debitis
          incidunt sed quam! Architecto a vero beatae. Temporibus delectus
          corrupti provident quisquam recusandae obcaecati! Quam quisquam
          possimus molestiae dolorem saepe dolorum, obcaecati quia? Magni
          placeat illo fuga neque possimus maxime hic ullam mollitia? Natus
          libero, odio distinctio reiciendis quisquam cum dolores quam amet
          velit consequatur.
        </p>
      </main>
    </div>
  )
}

export default HomePage
