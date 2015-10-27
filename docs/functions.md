## Functions

* [`_helpers.scss`](#helpers)

### <a id="helpers"></a>Helpers

The pixel-to-em or `pem` function returns an em value.

It sets a Sass variable, $base-font-size, to 16.

A value in em is defined as em = target/context.

#### Usage:

Here the default context is 16 ($base-font-size),
so there is no need to use a second argument.

```

.govuk-title {
  margin-top: pem(30);
}

Compiled css:

.govuk-title {
  margin-top: 1.875em;
}

```

The first argument will also accept pixel units.

```
.govuk-title {
  margin-top: pem(19px);
}

Compiled css:

.govuk-title {
  margin-top: 1.1875em;
}

```

If the context changes, use the second argument.

```
.govuk-title {
  font-size: 48px;
}

.govuk-title-child {
  margin-top: pem(15, 48);
}

Compiled css:

.govuk-title-child {
  margin-top: 0.3125em;
}