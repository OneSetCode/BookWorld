package com.onesetcode.springbootlibrary.dao;

import com.onesetcode.springbootlibrary.entity.Book;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

// By extending JpaRepository, Spring Data REST automatically detects the BookRepository interface and creates RESTful endpoints for the entity: Book -> \books
public interface BookRepository extends JpaRepository<Book, Long> {

    @Override
    @Cacheable(value = "books", key="#pageable")
    Page<Book> findAll(Pageable pageable);

    // the "title" in the @RequestParam refer to the name in database, and the outsider title refer to the variable name in the URL: localhost:8080/api/books/search/findByTitleContaining?title=as
    @Cacheable(value = "books", key="{#title, #pageable}")
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    @Cacheable(value = "books", key="{#category, #pageable}")
    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);

    @Cacheable(value = "books", key="#bookId.hashCode()")
    @Query("select o from Book o where id in :book_ids")
    List<Book> findBooksByBookIds (@Param("book_ids") List<Long> bookId);
}
