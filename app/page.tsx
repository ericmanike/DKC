import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Zap } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { ProductCard } from "@/components/ui/ProductCard";
import TestimonialCarousel from "@/components/ui/testimonials";
import RotatingText from "@/components/ui/RotatingText";


async function getFeaturedProducts() {
  try {
    await connectToDatabase();
    // Fetch 3 most recent products
    const products = await Product.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

const RotatingTextType: any = RotatingText;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();



  return (
    <div className="flex flex-col gap-20 pb-20 bg-gray-300">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full min-h-[500px] lg:h-[700px] flex items-center justify-center py-20 lg:py-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/intro1.png"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Master Your Future with{" "}
              <span className="text-orange-400">Premium Books</span> &{" "}
              <span className="text-blue-600">Expert Courses</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              Unlock your potential with our curated collection of industry-leading resources.
              Whether you're looking for deep-dive technical books or interactive video courses,
              DKC Books has everything you need to excel.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full
                 bg-blue-600 px-8 py-4 text-sm font-bold text-white hover:bg-blue-500
                  transition-all active:scale-95"
              >
                Browse Shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20
                 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/50
                   transition-all active:scale-95"
              >
                Join for Free
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 mt-12 font-semibold text-lg text-orange-400 drop-shadow-sm">
              <Zap className="h-5 w-5 fill-current" />
              Instant Access to All Resources
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="container  mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border 
          border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl text-slate-900 font-bold mb-3 ">Premium Books</h3>
            <p className="text-zinc-800 leading-relaxed">
              Curated technical and business books from industry leaders with lifelong access.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border
           border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
              <GraduationCap className="h-7 w-7 text-indigo-600" />
            </div>
            <h3 className="text-xl text-slate-900 font-bold mb-3">Expert Courses</h3>
            <p className="text-zinc-800 leading-relaxed">
              Structured video courses with hands-on projects designed to build real-world skills.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border
           border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl text-slate-900 font-bold mb-3">Instant Delivery</h3>
            <p className="text-zinc-800 leading-relaxed">
              Get immediate access to your digital files and course content right after purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Collections</h2>
            <p className="text-gray-600 mt-2">Explore our most popular books and courses.</p>
          </div>
          <Link href="/shop" className="text-blue-600 font-bold hover:text-blue-700 flex items-center">
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.title}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                category={product.category}
                productType={product.productType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">New arrivals coming soon!</p>
            <Link href="/shop" className="mt-4 inline-block text-blue-600 font-medium">Explore Shop</Link>
          </div>
        )}
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center items-center px-10">
        <div className="  rounded h-10 flex justify-center ">
          <div className=" border-double border-y-blue-600 border-2 border-x-orange-600  md:py-20 py-10 px-8   
          text-black md:text-6xl text-2xl  rounded-2xl flex justify-center items-center  w-fit">
            <RotatingTextType
              texts={['Resetting minds', 'Creating Wealth ', 'Building Skills', 'Achieving Goals']}
              rotationInterval={10000}
              splitBy="character"
              staggerDuration={0.05}

              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}

              className="te font-semibold "
            /> </div>
        </div>  <TestimonialCarousel /> </div>

      {/* Call to action Section */}
      <section className="container mx-auto px-4">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Start Your Learning Journey Today</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg relative z-10">
            Join thousands of learners worldwide and get access to high-quality educational content.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-full bg-white 
            px-10 py-4 text-sm font-bold text-blue-600 
             hover:bg-gray-100 transition-all active:scale-95 relative z-10"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
