import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);


    // The useEffect hook ensures that the side effect is performed at the appropriate time in the component's lifecycle. It runs after the component has rendered, which is the ideal time to initiate asynchronous operations. If you perform the fetch process outside the useEffect, it might run at an incorrect time, such as during the component's initialization, leading to inconsistent or unexpected behavior.
    useEffect(() => {
        const fetchBooks = async () => {
            // An asynchronous function can perform tasks asynchronously, meaning it can initiate operations and continue executing without waiting for those operations to complete. This allows other parts of the program to continue running while the asynchronous operation is being processed.
            const baseUrl: string = `${process.env.REACT_APP_API}/books`;

            const url: string = `${baseUrl}?page=0&size=9`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []); // Any state changes of the variables in the [] will trigger the function before. Left blank means that we don't want to change the carousel after it is first created.

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className="container" style={{ height: 480, marginTop: '70px' }}>
            
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5
                d-none d-lg-block" data-bs-interval='false'>
                {/* Desktop */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(0, 3).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(3, 6).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(6, 9).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Mobile */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <ReturnBook book={books[7]} key={books[7].id} />
                </div>
            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">View More</Link>
            </div>
        </div>
    );
}